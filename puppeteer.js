const parse = require("csv-parse/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse.toString("utf-8");

const crawler = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.google.com");
    await page.waitFor(3000);
    await page.close();
    await browser.close();
};

crawler();
