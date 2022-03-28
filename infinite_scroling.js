const puppeteer = require("puppeteer");

const crawler = async () => {
    try {
        const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
        const page = await browser.newPage();
        await page.goto("https://unsplash.com");
        let result = [];
        while (result.length <= 50) {
            const srcs = await page.evaluate(() => {
                window.scrollTo(0, 0); // 절대 좌표, 스크롤 맨 위에 위치
                const imgs = [];
                const imgEls = document.querySelectorAll("figure");
                console.log(`imgEls : ${imgEls}`);
                console.log(`imgEls.length : ${imgEls.length}`);
                if (imgEls.length) {
                    imgEls.forEach((y) => {
                        let src = y.querySelector("img.YVj9w").src;
                        if (src) imgs.push(src);
                        y.parentElement.removeChild(y);
                    });
                }
                setTimeout(() => {
                    window.scrollBy(0, 250); // 상대 좌표, 세로로 250픽셀 내림
                }, 500); // 0.5초 대기
                return imgs;
            });
            result = result.concat(srcs);
            await page.waitForSelector("figure");
            console.log("새 이미지 태그 로딩 완료!");
        }
        console.log(result);
        console.log(result.length);
        await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
