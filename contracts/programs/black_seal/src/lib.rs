use anchor_lang::prelude::*;

declare_id!("B45qckbUSwjCFUGCTFv7NnRdCh31WXhpLE4qT9Jc1Nhm");

pub const VAULT_SEED: &[u8] = b"black_seal_vault";
pub const MAX_BLOB_SIZE: usize = 8 * 1024; // 8 KiB encrypted blob cap

#[program]
pub mod black_seal {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.owner = ctx.accounts.owner.key();
        vault.version = 0;
        vault.last_updated = Clock::get()?.unix_timestamp;
        vault.data_size = 0;
        vault.encrypted_data = Vec::new();
        vault.bump = ctx.bumps.vault;
        Ok(())
    }

    pub fn upload_backup(ctx: Context<UploadBackup>, encrypted_data: Vec<u8>) -> Result<()> {
        require!(encrypted_data.len() <= MAX_BLOB_SIZE, VaultError::BlobTooLarge);
        let vault = &mut ctx.accounts.vault;
        vault.encrypted_data = encrypted_data;
        vault.data_size = vault.encrypted_data.len() as u32;
        vault.version = vault.version.checked_add(1).ok_or(VaultError::VersionOverflow)?;
        vault.last_updated = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn fetch_backup(ctx: Context<FetchBackup>) -> Result<Vec<u8>> {
        Ok(ctx.accounts.vault.encrypted_data.clone())
    }

    pub fn delete_vault(_ctx: Context<DeleteVault>) -> Result<()> {
        // Account closure returns rent lamports to owner (see constraints below).
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = owner,
        space = Vault::SIZE,
        seeds = [VAULT_SEED, owner.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(encrypted_data: Vec<u8>)]
pub struct UploadBackup<'info> {
    #[account(
        mut,
        seeds = [VAULT_SEED, owner.key().as_ref()],
        bump = vault.bump,
        has_one = owner @ VaultError::Unauthorized,
        realloc = Vault::header_size() + 4 + encrypted_data.len(),
        realloc::payer = owner,
        realloc::zero = false
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FetchBackup<'info> {
    #[account(
        seeds = [VAULT_SEED, owner.key().as_ref()],
        bump = vault.bump,
        has_one = owner @ VaultError::Unauthorized
    )]
    pub vault: Account<'info, Vault>,

    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteVault<'info> {
    #[account(
        mut,
        seeds = [VAULT_SEED, owner.key().as_ref()],
        bump = vault.bump,
        has_one = owner @ VaultError::Unauthorized,
        close = owner
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub owner: Signer<'info>,
}

#[account]
pub struct Vault {
    pub owner: Pubkey,
    pub version: u32,
    pub last_updated: i64,
    pub data_size: u32,
    pub bump: u8,
    pub encrypted_data: Vec<u8>,
}

impl Vault {
    // Discriminator (8) + owner (32) + version (4) + last_updated (8) + data_size (4) + bump (1)
    pub const fn header_size() -> usize {
        8 + 32 + 4 + 8 + 4 + 1
    }

    pub const SIZE: usize = Self::header_size() + 4 + MAX_BLOB_SIZE; // pre-allocate at init
}

#[error_code]
pub enum VaultError {
    #[msg("Encrypted blob exceeds maximum allowed size")]
    BlobTooLarge,
    #[msg("Version counter overflow")]
    VersionOverflow,
    #[msg("Signer is not the vault owner")]
    Unauthorized,
}
