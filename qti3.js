/**
 * QTC Quantum-Safe PQ-HD Wallet CLI (Pure JS)
 * Generates a quantum-safe hierarchical deterministic wallet using Kyber1024 and Dilithium3.
 * This implements QTC Core Method 2: PQ-HD Wallet for External Wallets.
 */

import { bech32 } from "bech32";
import { SHA3 } from "sha3";

// --- Main async function
async function generatePQHDWallet() {
  console.error("--- Starting Quantum-Safe PQ-HD Wallet Generation (External Wallet Method) ---");

  // Dynamic imports for crypto and fs
  const crypto = await import("crypto");
  const fs = await import("fs");

  // Dynamic imports for noble-post-quantum libraries
  const { ml_kem1024 } = await import("./noble-post-quantum JS/src/ml-kem.js");
  const { ml_dsa65 } = await import("./noble-post-quantum JS/src/ml-dsa.js");

  // --- 1. Generate Kyber1024 Keypair and Shared Secret
  let kyber_pk, kyber_sk, sharedSecret;
  try {
    // Generate a random seed for Kyber key generation
    const kyber_seed = crypto.randomBytes(64);
    const kyberKeyPair = ml_kem1024.keygen(kyber_seed);
    kyber_pk = kyberKeyPair.publicKey;
    kyber_sk = kyberKeyPair.secretKey;
    
    const { cipherText: cipher, sharedSecret: ss1 } = ml_kem1024.encapsulate(kyber_pk);
    const ss2 = ml_kem1024.decapsulate(cipher, kyber_sk);
    
    // The shared secret is the same from encapsulate and decapsulate
    sharedSecret = Buffer.from(ss1);
    
    console.error("[✓] Kyber KEM completed, shared secret established.");
  } catch (err) {
    console.error("[ERROR] Kyber operation failed:", err);
    process.exit(1);
  }

  // --- 2. Generate Dilithium3 Keypair (Deterministic from Kyber shared secret)
  let dilithium_pk, dilithium_sk;
  try {
    // Generate deterministic seed for Dilithium from Kyber shared secret
    const dilithium_seed = crypto.createHash("sha3-256")
      .update(sharedSecret)
      .update("QTC_PQHD_DILITHIUM")
      .digest();
    const dilithiumKeyPair = ml_dsa65.keygen(dilithium_seed);
    dilithium_pk = dilithiumKeyPair.publicKey;
    dilithium_sk = dilithiumKeyPair.secretKey;
    console.error("[✓] Dilithium3 deterministic keypair generated (PQ-HD method).");
  } catch (err) {
    console.error("[ERROR] Dilithium key generation failed:", err);
    process.exit(1);
  }

  // --- 3. Derive Master Entropy using SHA3-512(KyberSharedSecret || DilithiumPublicKey)
  const combined_input = Buffer.concat([sharedSecret, Buffer.from(dilithium_pk)]);
  const master_entropy = crypto.createHash("sha3-512").update(combined_input).digest();
  console.error(`[✓] Master entropy derived (SHA3-512): ${master_entropy.toString("hex").slice(0, 32)}...`);

  // --- 4. Generate PQ-HD Address from Master Entropy (PQ-HD Method)
  // a) Hash the master entropy using SHA3-256 (QUANTUM-SAFE)
  const hash = new SHA3(256);
  hash.update(Buffer.from(master_entropy));
  const entropyHash = hash.digest();

  // b) Get the first 20 bytes (160 bits) of the hash
  const addressBytes = entropyHash.slice(0, 20);

  // c) Convert to bech32m with "qtc" prefix and witness version 2 (PQ-HD method)
  const witnessVersion = 2;
  const witnessProgram = Array.from(addressBytes);
  const words = bech32.toWords(witnessProgram);
  const data = [witnessVersion, ...words];
  const address = bech32.encode("qtc", data);
  console.error(`[✓] Generated PQ-HD Address: ${address}`);

  // --- 5. Assemble the final PQ-HD wallet JSON
  const pqhd_wallet = {
    address: address,
    method: "PQ-HD",
    witness_version: 2,
    master_entropy_b64: master_entropy.toString("base64"),
    kyber_public_b64: Buffer.from(kyber_pk).toString("base64"),
    kyber_private_b64: Buffer.from(kyber_sk).toString("base64"),
    dilithium_public_b64: Buffer.from(dilithium_pk).toString("base64"),
    dilithium_private_b64: Buffer.from(dilithium_sk).toString("base64"),
    kyber_shared_secret_b64: sharedSecret.toString("base64"),
    combined_input_b64: combined_input.toString("base64"),
    algorithm: "Kyber1024-KEM + Dilithium3-DSA (Deterministic PQ-HD)",
    quantum_safe: true,
    version: "QTC-PQHD-1.0",
    description: "QTC PQ-HD Wallet for External Wallet Integration"
  };

  // --- 6. Save to file and print
  try {
    fs.writeFileSync("qti3_pqhd_wallet.json", JSON.stringify(pqhd_wallet, null, 2));
    console.error("\n[SUCCESS] PQ-HD Wallet generated and saved to 'qti3_pqhd_wallet.json'");
    // ONLY print the JSON to stdout
    console.log(JSON.stringify(pqhd_wallet, null, 2));
  } catch (err) {
    console.error("[ERROR] Could not write wallet file:", err);
    process.exit(1); // Exit with error if file write fails
  }
  
  console.error("\n--- PQ-HD Wallet Generation Complete ---");
  console.error("[INFO] This wallet uses QTC Core Method 2: PQ-HD for External Wallets");
  console.error("[INFO] Address uses witness version 2 (different from Primary method version 1)");
}

// --- Execute the main function
generatePQHDWallet().catch(err => {
  console.error("\n--- An unexpected error occurred ---");
  console.error(err);
  process.exit(1);
});