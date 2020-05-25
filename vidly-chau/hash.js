const bcrypt = require("bcrypt");

async function run(password) {
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  const hashed = await bcrypt.hash(password, salt);
  console.log(hashed);
}
run("abcd");
