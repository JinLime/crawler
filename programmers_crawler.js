const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");
const xlsx = require("xlsx");

const csv = fs.readFileSync("csv/lv2.csv");
const records = parse(csv.toString("utf-8"));

// const add_to_sheet = require("./xlsx/add_to_sheet");
// const workbook = xlsx.readFile("xlsx/lv2.xlsx");
// const ws = workbook.Sheets.Sheet1; // 엑셀 시트 이름
// const records = xlsx.utils.sheet_to_json(ws);

const crawler = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === "production",
            args: ["--window-size=2560,1440", "--disable-notifications"],
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 2560,
            height: 1440,
        });
        await page.goto("https://programmers.co.kr/learn/challenges?tab=all_challenges");

        await page.click(".form-group:nth-child(1) button");
        await page.waitForTimeout(500);
        await page.click(".form-group.show:nth-child(1) #challenge_filter_level_2");
        await page.waitForTimeout(500);
        await page.click(".form-group:nth-child(2) button");
        await page.waitForTimeout(500);
        await page.click(".form-group.show:nth-child(2) #challenge_filter_language_python3");
        await page.waitForTimeout(2000);
        const result = [];
        let data;

        for (let i = 2; i <= 5; i++) {
            let strI = String(i);
            if (i > 2) {
                await page.click(`.pagination [class=page-item]:nth-child(${strI}) a`);
                await page.waitForTimeout(2000);
            }

            for (let j = 1; j <= 20; j++) {
                let strJ = String(j);
                data = await page.evaluate((strJ) => {
                    // getAttribute('속성') : 요소의 속성값을 가져옴
                    const title = document
                        .querySelector(
                            `.col-item:nth-child(${strJ}) .card-algorithm.level-2 a .title`,
                        )
                        .textContent.trim()
                        .replace(/Lv\..+\s+\s/, "");

                    const href = document
                        .querySelector(`.col-item:nth-child(${strJ}) .card-algorithm.level-2 a`)
                        .href.replace(/https:.+\//, "");

                    const type = document.querySelector(
                        `.col-item:nth-child(${strJ}) .card-algorithm.level-2 .level`,
                    ).textContent;
                    return [title, href, type];
                    // return [title].map((v) => {return {제목: v,번호: href,유형: type,};});
                }, strJ);
                result.push(data);
                if (i === 5 && j === 7) break;
            }
        }

        console.log(result);
        console.log(result.length);

        records.result;

        const str = stringify(result);
        fs.writeFileSync("csv/lv2.csv", str);

        // add_to_sheet(ws, "A1", "s", "제목");
        // add_to_sheet(ws, "B1", "s", "번호");
        // add_to_sheet(ws, "B1", "s", "유형");
        // for (let i = 0; i < result.length; i++) {
        //     const newCellA = "A" + (i + 2);
        //     const newCellB = "B" + (i + 2);
        //     const newCellC = "C" + (i + 2);
        //     add_to_sheet(ws, newCellA, "s", result[i][0]);
        //     add_to_sheet(ws, newCellB, "n", result[i][1]);
        //     add_to_sheet(ws, newCellC, "s", result[i][2]);
        // }
        // xlsx.writeFile(workbook, "xlsx/lv2.xlsx");

        await page.close();
        await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
