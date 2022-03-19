const xlsx = require("xlsx");

const workbook = xlsx.readFile("xlsx/data.xlsx");

const ws = workbook.Sheets.영화목록;

const records = xlsx.utils.sheet_to_json(ws);

for (const [i, v] of records.entries()) {
  console.log(i, v.제목, v.링크);
}
