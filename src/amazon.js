const puppeteer = require("puppeteer");

const crawler = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === "production",
            args: ["--window-size=1920,1080", "--disable-notifications"],
        });

        let result = [];
        await Promise.all(
            [1, 2, 3, 4, 5, 6, 7, 8, 10].map(async (v) => {
                const page = await browser.newPage();
                await page.setViewport({
                    width: 1920,
                    height: 1080,
                });

                const keyword = "mouse";
                await page.goto(`https://www.amazon.com/s?k=${keyword}&page=${v}`, {
                    waitUntil: "networkidle0",
                });
                const r = await page.evaluate(() => {
                    const tags = document.querySelectorAll(".s-result-list > div");
                    const result = [];
                    tags.forEach((t) => {
                        result.push({
                            name:
                                t &&
                                t.querySelector("h5") &&
                                t.querySelector("h5").textContent.trim(),
                            price:
                                t &&
                                t.querySelector(".a-price") &&
                                t.querySelector(".a-offscreen").textContent.trim(),
                        });
                    });
                    return result;
                });
                result = result.concat(r);
            }),
        );
        console.log(result.length);
        console.log(result);

        // await page.close();
        // await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
