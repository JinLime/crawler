const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

dotenv.config();

const crawler = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === "production",
            args: ["--window-size=2560,1440", "--disable-notifications"],
            // userDataDir: 유저 쿠키 가져오기 (로그인 저장됨)
            userDataDir: "C:/Users/sj/AppData/Local/Google/Chrome/User Data/Default",
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
        if (await page.$('a[href="/jjjjinnnnn/"]')) console.log("이미 로그인 되어 있습니다.");
        else {
            page.waitForNavigation(); // React같은 싱글페이지에서 다른 페이지로 넘어가는 것을 기다림
            await page.type("._9GP1n [name=username]", process.env.EMAIL);
            await page.type("._9GP1n [name=password]", process.env.PASSWORD);
            await page.waitForTimeout(2000);
            await page.click(".qF0y9 [type=submit]");
            await page.waitForResponse((response) => {
                return response.url().includes("square_gradient_192.png/7c119b0c5722.png");
            });
            await page.click(".cmbtv");
            console.log("로그인을 완료했습니다");
        }

        await page.waitForSelector(".XTCLo.d_djL.DljaH");
        await page.click(".XTCLo.d_djL.DljaH");
        await page.keyboard.type("맛집");
        await page.waitForSelector(".-qQT3");
        const href = await page.evaluate(() => {
            return document.querySelector(".-qQT3").href;
        });
        await page.goto(href);

        // await page.close();
        // await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
