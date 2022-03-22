const { parse } = require("csv-parse/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
    try {
        const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
        await Promise.all(
            records.map(async (v, i) => {
                try {
                    const page = await browser.newPage();
                    await page.goto(v[1]);

                    // const scoreEl = await page.$(".score.score_left .star_score");
                    // if (scoreEl) {
                    //     const text = await page.evaluate((tag) => tag.textContent, scoreEl);
                    //     console.log(v[0], "평점 :", text.trim());
                    // }

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
                    await page.close();
                } catch (e) {
                    console.error(e);
                }
            }),
        );
        await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
