const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const db = require("./models");
const { first } = require("cheerio/lib/api/traversing");
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
        await page.goto("https://instagram.com");
        await page.waitForResponse((response) => {
            return response.url().includes("logging_client_events");
        });
        // page.waitForNavigation(); // React같은 싱글페이지에서 다른 페이지로 넘어가는 것을 기다림
        await page.type("._9GP1n [name=username]", process.env.EMAIL);
        await page.type("._9GP1n [name=password]", process.env.PASSWORD);
        await page.waitForTimeout(2000);
        await page.click(".qF0y9 [type=submit]");
        await page.waitForResponse((response) => {
            return response.url().includes("square_gradient_192.png/7c119b0c5722.png");
        });
        await page.click(".cmbtv");

        // await page.close();
        // await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
