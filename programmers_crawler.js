const puppeteer = require("puppeteer");

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
        await page.goto("https://programmers.co.kr/learn/challenges?tab=all_challenges");

        await page.click(".form-group:nth-child(1) button");
        await page.waitForTimeout(500);
        await page.click(".form-group.show:nth-child(1) #challenge_filter_level_2");
        await page.waitForTimeout(500);
        await page.click(".form-group:nth-child(2) button");
        await page.waitForTimeout(500);
        await page.click(".form-group.show:nth-child(2) #challenge_filter_language_python3");

        const data = await page.evaluate(() => {
            // getAttribute('속성') : 요소의 속성값을 가져옴
            const href = Array.from(document.querySelectorAll(".col-item:nth-child(1)")).map((v) =>
                v.getAttribute("href"),
            );

            const title = Array.from(
                document.querySelectorAll(".col-item:nth-child(1) .title"),
            ).map((v) => v.textContent);

            return [href, title];
        });

        console.log(data.href, data.title);

        // await page.close();
        // await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
