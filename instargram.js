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

        // react-virtualized 사용하여 태크 최대 8개로 메모리를 절약
        let result = [];
        let prevPostId = "";

        while (result.length < 10) {
            const newPost = await page.evaluate(() => {
                const article = document.querySelector("article:nth-child(1)");
                const postId =
                    article.querySelector(".c-Yi7") && article.querySelector(".c-Yi7").href;
                const name =
                    article.querySelector(".Jv7Aj > a") &&
                    article.querySelector(".Jv7Aj > a").textContent;
                const img =
                    article.querySelector(".KL4Bh img") && article.querySelector(".KL4Bh img").src;
                return { postId, name, img };
            });

            if (newPost.postId !== prevPostId) {
                if (!result.find((v) => v.postId == newPost.postId)) {
                    result.push(newPost);
                }
            }
            prevPostId = newPost.postId;

            await page.evaluate(() => {
                window.scrollBy(0, 600);
            });
        }

        console.log(result);

        // await page.close();
        // await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
