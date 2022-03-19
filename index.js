const { parse } = require("csv-parse/sync");
const fs = require("fs");

const csv = fs.readFileSync("csv/data.csv");
// console.log(csv.toString("utf-8"));

const records = parse(csv.toString("utf-8"));

records.forEach((v, i) => {
  console.log(i, v);
});
