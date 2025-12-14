# QTC Quantum-Safe Wallet Generation

This directory contains JavaScript implementations of QTC's quantum-safe wallet generation methods using Kyber1024 KEM and Dilithium3 signatures.

## Files

### Core Implementations
- **`qti2.js`** - Primary Wallet Method (QTC Core Method 1)
- **`qti3.js`** - PQ-HD Wallet Method (QTC Core Method 2)
- **`compare_wallets.js`** - Comparison script between methods

### Dependencies
- **`noble-post-quantum JS/`** - Production-grade post-quantum cryptography library
- **`package.json`** - Node.js dependencies (bech32, sha3)

## Usage

### Generate Primary Wallet (Method 1)
```bash
node qti2.js
```
Creates: `qti2_wallet.json`
- Witness version: 1
- Dilithium keys: Deterministic from Kyber shared secret
- Address: SHA3-256(Dilithium Public Key)
- Purpose: Direct QTC native wallets

### Generate PQ-HD Wallet (Method 2)
```bash
node qti3.js
```
Creates: `qti3_pqhd_wallet.json`
- Witness version: 2
- Dilithium keys: Random generation
- Address: SHA3-256(Master Entropy)
- Purpose: External wallet integration

### Compare Methods
```bash
node compare_wallets.js
```
Shows detailed comparison between wallet generation methods.

## Key Differences

| Feature | Primary (qti2.js) | PQ-HD (qti3.js) | 
|---------|-------------------|-------------------|---------------------|
| Witness Version | 1 | 2 |
| Dilithium Keys | Deterministic | Deterministic (from SS) |
| Entropy Source | Kyber Shared Secret | Combined Input |
| Address Generation | SHA3-256(Dilithium) | SHA3-256(Master) |
| Use Case | Native QTC | External Wallets |

## Security

All methods provide quantum-safe security using:
- **Kyber1024 KEM**: NIST-selected quantum-safe key encapsulation
- **Dilithium3**: NIST-selected quantum-safe digital signatures
- **SHA3-512/256**: Quantum-resistant hash functions
- **bech32m**: Error-correcting address encoding

## Technical Details

### Primary Method Flow
1. Generate Kyber1024 keypair
2. Create shared secret via encapsulate/decapsulate
3. Derive entropy: SHAKE256
4. Generate deterministic Dilithium3 keys from entropy
5. Generate address: SHA3-256(dilithium_public_key) → bech32m

### PQ-HD Method Flow
1. Generate Kyber1024 keypair
2. Derive deterministic Dilithium3 keypair from Kyber shared secret
3. Derive master entropy: SHA3-512(shared_secret || dilithium_public_key)
4. Generate address: SHA3-256(master_entropy) → bech32m

## Compatibility

All wallet types are fully compatible with QTC network:
- Addresses use bech32m encoding with "qtc" prefix
- Witness versions (1, 2) distinguish wallet types
- All transactions are quantum-safe
- Support Kyber1024 KEM for encrypted communications

## Integration

### For QTC Core Integration
- **Method 1:** Use `qti2.js` for native wallet generation (matches `QtcPrimaryWallet`)
- **Method 2:** Use `qti3.js` for external wallet compatibility (matches `QtcPQHDWallet`)

## Dependencies Installation

```bash
npm install
```

## Requirements

- Node.js 16+ with ES modules support
- 64-bit system for optimal performance
- Secure random number generator (CSPRNG)

## Notes

- Implementations are production-ready and match QTC Core C++ designs
- Private keys are stored in base64 format for easy integration
- Shared secrets are included for debugging and verification
- All cryptographic operations use constant-time implementations
