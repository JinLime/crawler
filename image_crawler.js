const { parse } = require("csv-parse/sync");
const fs = require("fs");
const axios = require("axios");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

fs.readdir("poster", (err) => {
    if (err) {
        console.log("poster 폴더가 없어 poster 폴더를 생성합니다.");
        fs.mkdirSync("poster");
    }
});
fs.readdir("screenshot", (err) => {
    if (err) {
        console.log("screenshot 폴더가 없어 screenshot 폴더를 생성합니다.");
        fs.mkdirSync("screenshot");
    }
});

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

            const result = await page.evaluate(() => {
                const scoreEl = document.querySelector(".score.score_left .star_score");
                let score = "";
                if (scoreEl) {
                    score = scoreEl.textContent;
                }

                const imgEl = document.querySelector(".poster img");
                let img = "";
                if (imgEl) {
                    img = imgEl.src;
                }
                return { score, img };
            });

            if (result.score) {
                console.log(v[0], "평점 :", result.score.trim());
            }
            if (result.img) {
                const imgResult = await axios.get(result.img, {
                    responseType: "arraybuffer",
                });
                fs.writeFileSync(`poster/${v[0]}.jpg`, imgResult.data);
            }
            await page.waitForTimeout(2000);
        }

        await page.close();
        await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
