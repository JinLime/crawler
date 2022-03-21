const puppeteer = require("puppeteer");

const crawler = async () => {
    // headless: true = 화면 안보임(배보용), false = 화면 보임(개발용)
    const browser = await puppeteer.launch({ headless: false });
    const [page1, page2] = await Promise.all([browser.newPage(), browser.newPage()]);

    await Promise.all([page1.goto("https://www.naver.com/"), page2.goto("https://www.google.com")]);

    await Promise.all([page1.waitForTimeout(3000), page2.waitForTimeout(5000)]);

    await page1.close();
    await page2.close();
    await browser.close();
};

crawler();
