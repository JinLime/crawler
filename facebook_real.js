const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const db = require("./models");
dotenv.config();

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
        await page.goto("https://facebook.com");
        await page.type("#email", process.env.EMAIL);
        await page.type("#pass", process.env.PASSWORD);
        await page.waitForTimeout(1000);
        await page.click("button");

        // 로그인 완료될 때까지 대기
        await page.waitForResponse((response) => {
            return response.url().includes("qsAiCW00XaO.js?_nc");
        });
        // 시작 페이지 클릭
        await page.click(".p361ku9c:nth-child(3)");
        // 피드 로딩 대기
        await page.waitForSelector(".du4w35lb.k4urcfbm.l9j0dhe7.sjgh65i0:nth-child(1)");

        const newPost = await page.evaluate(() => {
            const firstFeed = document.querySelector(
                ".du4w35lb.k4urcfbm.l9j0dhe7.sjgh65i0:nth-child(1)",
            );
            const name =
                firstFeed.querySelector(".gmql0nx0.l94mrbxd .nc684nl6") &&
                firstFeed.querySelector(".gmql0nx0.l94mrbxd .nc684nl6").textContent;
            return { name };
        });
        console.log(newPost);
        // await page.close();
        // await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
