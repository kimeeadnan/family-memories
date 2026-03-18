const bcrypt = require("bcryptjs");

const password = process.argv[2];
if (!password) {
  console.log("Usage: node scripts/hash-password.js <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("Hash for your .env.local:");
console.log(hash);
console.log("\nExample: FAMILY_PASSWORD_HASH=" + hash);
