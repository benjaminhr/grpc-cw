const arr = Array(512)
  .fill(null)
  .map(() => Array(512).fill(Math.floor(Math.random() * 6) + 1));

const fs = require("fs");

fs.writeFileSync("./m.txt", JSON.stringify(arr));
