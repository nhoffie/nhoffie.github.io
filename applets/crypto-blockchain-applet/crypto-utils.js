/**
 * Crypto Utilities for Educational Blockchain
 * Implements SHA-256 hashing for proof-of-work mining
 */

/**
 * Pure JavaScript SHA-256 implementation
 * Based on public domain implementations
 */
class SHA256 {
  constructor() {
    // SHA-256 constants (first 32 bits of fractional parts of cube roots of first 64 primes)
    this.K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
  }

  /**
   * Right rotate a 32-bit integer
   */
  rotr(n, x) {
    return (x >>> n) | (x << (32 - n));
  }

  /**
   * SHA-256 compression function
   */
  hash(message) {
    // Initial hash values (first 32 bits of fractional parts of square roots of first 8 primes)
    let H = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    // Convert message to bytes
    const msgBytes = this.stringToBytes(message);

    // Pre-processing: padding
    const paddedMsg = this.pad(msgBytes);

    // Process message in 512-bit (64-byte) chunks
    for (let i = 0; i < paddedMsg.length; i += 64) {
      const chunk = paddedMsg.slice(i, i + 64);
      H = this.processChunk(chunk, H);
    }

    // Convert hash to hex string
    return H.map(h => {
      return ((h >>> 0).toString(16).padStart(8, '0'));
    }).join('');
  }

  /**
   * Convert string to byte array
   */
  stringToBytes(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode < 0x80) {
        bytes.push(charCode);
      } else if (charCode < 0x800) {
        bytes.push(0xc0 | (charCode >> 6));
        bytes.push(0x80 | (charCode & 0x3f));
      } else if (charCode < 0x10000) {
        bytes.push(0xe0 | (charCode >> 12));
        bytes.push(0x80 | ((charCode >> 6) & 0x3f));
        bytes.push(0x80 | (charCode & 0x3f));
      } else {
        bytes.push(0xf0 | (charCode >> 18));
        bytes.push(0x80 | ((charCode >> 12) & 0x3f));
        bytes.push(0x80 | ((charCode >> 6) & 0x3f));
        bytes.push(0x80 | (charCode & 0x3f));
      }
    }
    return bytes;
  }

  /**
   * Pad message to multiple of 512 bits
   */
  pad(msgBytes) {
    const msgLen = msgBytes.length;
    const bitLen = msgLen * 8;

    // Append single '1' bit (0x80)
    const padded = [...msgBytes, 0x80];

    // Append zeros until length ≡ 448 (mod 512)
    while ((padded.length % 64) !== 56) {
      padded.push(0);
    }

    // Append message length as 64-bit big-endian integer
    for (let i = 7; i >= 0; i--) {
      padded.push((bitLen >>> (i * 8)) & 0xff);
    }

    return padded;
  }

  /**
   * Process a single 512-bit chunk
   */
  processChunk(chunk, H) {
    const W = new Array(64);

    // Prepare message schedule
    for (let t = 0; t < 16; t++) {
      W[t] = (chunk[t * 4] << 24) | (chunk[t * 4 + 1] << 16) |
             (chunk[t * 4 + 2] << 8) | chunk[t * 4 + 3];
    }

    for (let t = 16; t < 64; t++) {
      const s0 = this.rotr(7, W[t - 15]) ^ this.rotr(18, W[t - 15]) ^ (W[t - 15] >>> 3);
      const s1 = this.rotr(17, W[t - 2]) ^ this.rotr(19, W[t - 2]) ^ (W[t - 2] >>> 10);
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0;
    }

    // Initialize working variables
    let [a, b, c, d, e, f, g, h] = H;

    // Main compression loop
    for (let t = 0; t < 64; t++) {
      const S1 = this.rotr(6, e) ^ this.rotr(11, e) ^ this.rotr(25, e);
      const ch = (e & f) ^ ((~e) & g);
      const temp1 = (h + S1 + ch + this.K[t] + W[t]) >>> 0;
      const S0 = this.rotr(2, a) ^ this.rotr(13, a) ^ this.rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    // Add compressed chunk to current hash value
    return [
      (H[0] + a) >>> 0,
      (H[1] + b) >>> 0,
      (H[2] + c) >>> 0,
      (H[3] + d) >>> 0,
      (H[4] + e) >>> 0,
      (H[5] + f) >>> 0,
      (H[6] + g) >>> 0,
      (H[7] + h) >>> 0
    ];
  }
}

// Create singleton instance
const sha256Hasher = new SHA256();

/**
 * Hash any data using SHA-256
 * @param {*} data - Data to hash (will be converted to string)
 * @returns {string} - Hex string of hash
 */
export function sha256(data) {
  const message = typeof data === 'string' ? data : JSON.stringify(data);
  return sha256Hasher.hash(message);
}

/**
 * Check if a hash meets difficulty requirement
 * @param {string} hash - Hash to check
 * @param {number} difficulty - Required number of leading zeros
 * @returns {boolean}
 */
export function meetsRequired(hash, difficulty) {
  const prefix = '0'.repeat(difficulty);
  return hash.startsWith(prefix);
}

/**
 * Count leading zeros in a hash
 * @param {string} hash - Hash to analyze
 * @returns {number} - Number of leading zeros
 */
export function countLeadingZeros(hash) {
  let count = 0;
  for (const char of hash) {
    if (char === '0') count++;
    else break;
  }
  return count;
}

/**
 * Generate a random address (base58-style)
 * Format: 1{random base58 chars}
 * @returns {string} - Bitcoin-style address
 */
export function generateAddress() {
  const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const length = 33; // Typical Bitcoin address length

  let address = '1'; // Bitcoin addresses start with 1
  for (let i = 1; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * base58Chars.length);
    address += base58Chars[randomIndex];
  }

  return address;
}

/**
 * Validate address format
 * @param {string} address - Address to validate
 * @returns {boolean}
 */
export function isValidAddress(address) {
  if (!address || typeof address !== 'string') return false;
  if (address.length !== 33) return false;
  if (!address.startsWith('1')) return false;

  const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  for (const char of address) {
    if (!base58Chars.includes(char)) return false;
  }

  return true;
}

/**
 * Generate transaction ID from transaction data
 * @param {Object} tx - Transaction object
 * @returns {string} - Transaction ID (hash)
 */
export function generateTxId(tx) {
  const txData = {
    inputs: tx.inputs,
    outputs: tx.outputs,
    timestamp: tx.timestamp
  };
  return sha256(txData);
}
