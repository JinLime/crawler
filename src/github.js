// puppeteer base
const puppeteer = require("puppeteer");

const crawler = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === "production",
            args: ["--window-size=1920,1080", "--disable-notifications"],
        });
        const page = await browser.newPage();
        // 봇 검사할 때, 피해가는 법1
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.104 Whale/3.13.131.36 Safari/537.36",
        );
        await page.setViewport({
            width: 1920,
            height: 1080,
        });
        const keyword = "crawler";
        await page.goto(`https://github.com/search?q=${keyword}`, {
            waitUntil: "networkidle0",
        });

        let result = [];
        let pageNum = 1;
        while (pageNum <= 3) {
            const r = await page.evaluate(() => {
                const tags = document.querySelectorAll(".repo-list-item");
                const result = [];
                tags.forEach((t) => {
                    result.push({
                        name:
                            t && t.querySelector("h3") && t.querySelector("h3").textContent.trim(),
                        star:
                            t &&
                            t.querySelector(".muted-link") &&
                            t.querySelector(".muted-link").textContent.trim(),
                        lang:
                            t &&
                            t.querySelector(".text-gray.flex-auto") &&
                            t.querySelector(".text-gray.flex-auto").textContent.trim(),
                    });
                });
                return result;
            });
            result.push(r);
            await page.waitForSelector(".next_page");
            await page.click(".next_page");
            pageNum++;
            // 다음 페이지 응답 대기
            await page.waitForResponse((response) => {
                return (
                    response.url().startsWith(`https://github.com/search/count?p=${pageNum}`) &&
                    response.status() === 200
                );
            });
            await page.waitForTimeout(3000);
        }
        console.log(result.length);
        console.log(result);

        // await page.close();
        // await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
