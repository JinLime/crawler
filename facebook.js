const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const crawler = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === "production",
            args: ["--window-size=1920,1080"],
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
        });
        await page.goto("https://facebook.com");
        // .env에서 가져옴
        const id = process.env.EMAIL;
        const password = process.env.PASSWORD;

        // await page.evaluate(
        //     (id, password) => {
        //         document.querySelector("#email").value = id;
        //         document.querySelector("#pass").value = password;
        //         document.querySelector("button").click();
        //     }, id, password);

        // puppeteer에서 지원하는 API
        await page.type("#email", process.env.EMAIL);
        await page.type("#pass", process.env.PASSWORD);
        await page.hover("button"); // "button"위에 마우스 올리기
        await page.waitForTimeout(3000);
        await page.click("button");
        await page.waitForTimeout(5000);
        // await page.keyboard.press("Escape"); // ESC키 누르기
        await page.click(
            'path[d="M10 14a1 1 0 0 1-.755-.349L5.329 9.182a1.367 1.367 0 0 1-.205-1.46A1.184 1.184 0 0 1 6.2 7h7.6a1.18 1.18 0 0 1 1.074.721 1.357 1.357 0 0 1-.2 1.457l-3.918 4.473A1 1 0 0 1 10 14z"]',
        );
        await page.waitForTimeout(5000);
        await page.click("div.a8nywdso.sj5x9vvc.rz4wbd8a.ecm0bbzt > div > div:nth-child(4)");
        // await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
