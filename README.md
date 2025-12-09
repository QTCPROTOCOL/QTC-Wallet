# QTC Quantum-Safe Wallet Generation (Q4)

This directory contains JavaScript implementations of QTC's quantum-safe wallet generation methods using Kyber1024 KEM and Dilithium3 signatures.

## Files

### Core Implementations
- **`qti2.js`** - Primary Wallet Method (QTC Core Method 1)
- **`qti3.js`** - Single PQ-HD Wallet Method (QTC Core Method 2)
- **`qti3_hd.js`** - Multi-Address PQ-HD HD Wallet (QTC Core Method 2)
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

### Generate Single PQ-HD Wallet (Method 2)
```bash
node qti3.js
```
Creates: `qti3_pqhd_wallet.json`
- Witness version: 2
- Dilithium keys: Random generation
- Address: SHA3-256(Master Entropy)
- Purpose: External wallet integration

### Generate Multi-Address PQ-HD HD Wallet (Method 2)
```bash
# Generate 10 PQ-HD addresses (default behavior)
node qti3_hd.js

# Generate 10 addresses for account 0, change 0 (explicit)
node qti3_hd.js 10 0 0

# Generate 5 addresses for account 1, change 1
node qti3_hd.js 5 1 1

# Generate 20 addresses for account 0, change 0
node qti3_hd.js 20 0 0
```

**Default Behavior**: qti3_hd.js generates 10 addresses for account 0, change 0

### Custom Address Generation
```bash
# Generate 3 addresses for account 0, change 0
node qti3_hd.js 3 0 0

# Generate 10 addresses for account 2, change 1
node qti3_hd.js 10 2 1
```

### Compare Both Methods
```bash
node compare_wallets.js
```
Shows detailed comparison between Primary and PQ-HD methods.

## Key Differences

| Feature | Primary (qti2.js) | PQ-HD (qti3.js) |
|---------|-------------------|-------------------|
| Method | QTC Core Method 1 | QTC Core Method 2 |
| Witness Version | 1 | 2 |
| Dilithium Keys | Deterministic | Random |
| Entropy Source | Kyber Shared Secret | Combined Input |
| Address Generation | SHA3-256(Dilithium) | SHA3-256(Master) |
| Purpose | Direct QTC Use | External Wallets |

## Security

Both methods provide quantum-safe security using:
- ✅ **Kyber1024 KEM**: NIST-selected quantum-safe key encapsulation
- ✅ **Dilithium3**: NIST-selected quantum-safe digital signatures  
- ✅ **SHA3-512/256**: Quantum-resistant hash functions
- ✅ **bech32m Encoding**: Error-correcting address format

### ⚠️ **Classical RNG Vulnerability**
- **Current Issue**: `crypto.randomBytes()` is NOT quantum-safe
- **Risk Level**: MEDIUM (quantum computers don't exist yet)
- **Mitigation**: Multiple entropy sources, user input, future quantum RNG

### 🔧 **HD Wallet Security (✅)**
- **Hierarchical Derivation**: SHA3-512(master_entropy || path || index)
- **Deterministic**: Same master → same addresses
- **Quantum-safe**: Inherits security from Kyber KEM

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
- Use PQ-HD Method (qti3.js/qti3_hd.js) for external wallet compatibility
- Matches QTC Core's `QtcPQHDWallet::GeneratePQHDWallet()`

## Dependencies Installation

```bash
npm install
```

## Requirements

- Node.js 16+ with ES modules support
- 64-bit system for optimal performance
- Secure random number generator (CSPRNG)

## CLI Usage Examples

### Single Address Generation
```bash
# Generate primary wallet (Method 1)
node qti2.js

# Generate single PQ-HD wallet (Method 2)
node qti3.js
```

### Multi-Address HD Wallet Generation
```bash
# Generate 10 PQ-HD addresses (default)
node qti3_hd.js

# Generate 10 addresses for account 0, change 0 (explicit)
node qti3_hd.js 10 0 0

# Generate 5 addresses for account 1, change 1
node qti3_hd.js 5 1 1

# Generate 20 addresses for account 0, change 0
node qti3_hd.js 20 0 0

# Generate 3 addresses for account 0, change 0
node qti3_hd.js 3 0 0

# Generate 10 addresses for account 2, change 1
node qti3_hd.js 10 2 1
```

### Advanced Usage
```bash
# Generate custom number of addresses
node qti3_hd.js 15 0 0

# Generate addresses for specific account and change
node qti3_hd.js 8 2 1
```

## HD Path Structure

- **Format**: `m/44'/account'/change/index`
- **Account**: BIP-44 style account derivation
- **Change**: 0 = receiving, 1 = change
- **Index**: Sequential address index

## Security Best Practices

- **Backup**: Store master keys securely
- **Recovery**: Use master entropy for wallet recovery
- **Isolation**: Each address has independent Dilithium keys
- **Quantum Safety**: All addresses inherit quantum security from Kyber1024 KEM

## Notes

- Both methods are production-ready and match QTC Core C++ implementations
- Private keys are stored in base64 format for easy integration
- Shared secrets are included for debugging and verification
- All cryptographic operations use constant-time implementations