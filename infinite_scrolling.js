const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

fs.readdir("imgs", (err) => {
    if (err) {
        console.error("imgs 폴더가 없어 imgs 폴더를 생성합니다.");
        fs.mkdirSync("imgs");
    }
});

const crawler = async () => {
    try {
        const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
        const page = await browser.newPage();
        await page.goto("https://unsplash.com");
        let result = [];
        while (result.length <= 10) {
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
            // 다음 이미지가 로딩 될 때까지 대기
            await page.waitForSelector("figure");
            console.log("새 이미지 태그 로딩 완료!");
        }
        // console.log(result);
        console.log(result.length);
        result.forEach(async (src) => {
            // 이미지 링크를 Array Buffer 바꿈 (이미지링크 저장)
            const imgResult = await axios.get(src.replace(/\?.*$/, ""), {
                responseType: "arraybuffer",
            });
            fs.writeFileSync(`imgs/${new Date().valueOf()}.jpeg`, imgResult.data);
            console.log("이미지 다운로드가 완료되었습니다.");
        });
        await browser.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
