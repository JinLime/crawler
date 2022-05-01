const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const dotenv = require("dotenv");
const fs = require("fs");
const ytdl = require("ytdl-core"); // 유튜브 다운로드 라이브러리

puppeteer.use(StealthPlugin());
dotenv.config();

const crawler = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === "production",
            args: ["--window-size=2560,1440", "--disable-notifications"],
            userDataDir: "C:/Users/sj/AppData/Local/Google/Chrome/User Data",
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 2560,
            height: 1440,
        });
        await page.goto("https://youtube.com", {
            waitUntil: "networkidle0", // 네트워크 요청 모두 불러올 때까지 기다림, 단 영상 같은 경우는 계속 불러와야 하므로 사용 X
        });

        // 구글 로그인
        // await page.waitForSelector("#buttons ytd-button-renderer:last-child a");
        // await page.click("#buttons ytd-button-renderer:last-child a");

        // await page.waitForNavigation({
        //     waitUntil: "networkidle2", // 네트워크 요청 2개정도 남기고 기다림
        // });

        // await page.waitForSelector("#identifierId");
        // await page.type("#identifierId", process.env.EMAIL);
        // await page.waitForSelector("#identifierNext");
        // await page.click("#identifierNext");

        // await page.click(".d2laFc"); // 저장된 아이디 버튼 클릭

        // await page.waitForNavigation({
        //     waitUntil: "networkidle2", // 네트워크 요청 2개정도 남기고 기다림
        // });

        // await page.waitForSelector('input[aria-label="Enter your password"]');
        // // await page.type('input[aria-label="Enter your password"]', process.env.PASSWORD);
        // await page.evaluate((password) => {
        //     document.querySelector('input[aria-label="Enter your password"]').value = password;
        // }, process.env.PASSWORD);
        // await page.waitFor(2000);
        // await page.waitForSelector("#passwordNext");
        // await page.click("#passwordNext");

        // await page.waitForNavigation({
        //     waitUntil: "networkidle2", // 네트워크 요청 2개정도 남기고 기다림
        // });

        // 영상 다운로드
        await page.waitFor(1000);
        await page.goto("https://www.youtube.com/watch?v=22rreBwLim8");

        const url = await page.url(); // 현재 주소
        const title = await page.title(); // 현재 제목
        console.log(url, title);

        const info = ytdl.getInfo(url); // 동영상 정보
        console.log(info);

        ytdl(url).pipe(fs.createWriteStream(`${title}.mp4`));

        // await page.close();
        // await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
