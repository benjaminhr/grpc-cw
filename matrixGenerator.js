let arr = Array(1024)
  .fill(null)
  .map(() => Array(1024).fill(Math.floor(Math.random() * 6) + 1));

arr = arr.map((row) => row.join(" ")).join("\n");

const fs = require("fs");

fs.writeFileSync("./m.txt", arr);
