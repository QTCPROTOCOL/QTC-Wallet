# QTC Quantum-Safe Wallet Generation (Q4)

This directory contains JavaScript implementations of QTC's quantum-safe wallet generation methods using Kyber1024 KEM and Dilithium3 signatures.

## Files

### Core Implementations
- **`qti2.js`** - Primary Wallet Method (QTC Core Method 1)
- **`qti3.js`** - PQ-HD Wallet Method (QTC Core Method 2) 
- **`compare_wallets.js`** - Comparison script between both methods

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

### Compare Both Methods
```bash
node compare_wallets.js
```
Shows detailed comparison between Primary and PQ-HD methods.

## Key Differences

| Feature | Primary (qti2.js) | PQ-HD (qti3.js) |
|---------|-------------------|-------------------|
| Witness Version | 1 | 2 |
| Dilithium Keys | Deterministic | Random |
| Entropy Source | Kyber Shared Secret | Combined Input |
| Address Generation | SHA3-256(Dilithium) | SHA3-256(Master) |
| Use Case | Native QTC | External Wallets |

## Security

Both methods provide quantum-safe security using:
- **Kyber1024 KEM**: NIST-selected quantum-safe key encapsulation
- **Dilithium3**: NIST-selected quantum-safe digital signatures
- **SHA3-512/256**: Quantum-resistant hash functions
- **bech32m**: Error-correcting address encoding

## Technical Details

### Primary Method Flow
1. Generate Kyber1024 keypair
2. Create shared secret via encapsulate/decapsulate
3. Derive entropy: SHA3-512(shared_secret)
4. Generate deterministic Dilithium3 keys from entropy
5. Generate address: SHA3-256(dilithium_public_key) → bech32m

### PQ-HD Method Flow
1. Generate Kyber1024 keypair
2. Generate random Dilithium3 keypair
3. Derive master entropy: SHA3-512(shared_secret || dilithium_public_key)
4. Generate address: SHA3-256(master_entropy) → bech32m

## Compatibility

Both wallet types are fully compatible with QTC network:
- Addresses use bech32m encoding with "qtc" prefix
- Witness versions (1 and 2) distinguish wallet types
- All transactions are quantum-safe
- Both support Kyber1024 KEM for encrypted communications

## Integration

### For QTC Core Integration
- Use Primary Method (qti2.js) for native wallet generation
- Matches QTC Core's `QtcPrimaryWallet::GenerateWallet()`

### For External Wallet Integration  
- Use PQ-HD Method (qti3.js) for external wallet compatibility
- Matches QTC Core's `QtcPQHDWallet::GeneratePQHDWallet()`
- Supports hierarchical deterministic derivation

## Dependencies Installation

```bash
npm install
```

## Requirements

- Node.js 16+ with ES modules support
- 64-bit system for optimal performance
- Secure random number generator (CSPRNG)

## Notes

- Both methods are production-ready and match QTC Core C++ implementations
- Private keys are stored in base64 format for easy integration
- Shared secrets are included for debugging and verification
- All cryptographic operations use constant-time implementations