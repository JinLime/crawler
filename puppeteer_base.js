const puppeteer = require("puppeteer");

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
        await page.goto("https://google.com");
        await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
