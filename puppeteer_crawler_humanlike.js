const { parse } = require("csv-parse/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
    try {
        const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
        const page = await browser.newPage();
        // 브라우저 콘솔창에 navigator.userAgent 입력
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.104 Whale/3.13.131.36 Safari/537.36",
        );
        for (const [i, v] of records.entries()) {
            await page.goto(v[1]);

            const text = await page.evaluate(() => {
                const score = document.querySelector(".score.score_left .star_score");
                if (score) {
                    return score.textContent;
                }
            });

            if (text) {
                console.log(v[0], "평점 :", text.trim());
            }
            await page.waitForTimeout(5000);
        }

        await page.close();
        await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
