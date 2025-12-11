const jwt = require('jsonwebtoken');
const hmacKey = process.argv[2];
const programId = process.argv[3];
const currentTimestamp = Math.floor(Date.now() / 1000);
const payload = { iat: currentTimestamp, sub: programId };
const options = { algorithm: "HS512", header: { typ: "JWT", alg: "HS512" } };
const token = jwt.sign(payload, hmacKey, options);
console.log(token);
