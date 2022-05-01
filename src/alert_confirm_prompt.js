const puppeteer = require("puppeteer");

const crawler = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === "production",
            args: ["--window-size=1920,1080"],
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
        });

        // ------alert-----
        // page.on("dialog", async (dialog) => {
        //     console.log(dialog.type(), dialog.message());
        //     await dialog.dismiss();
        // });

        // await page.evaluate(() => {
        //     alert("이 창이 꺼져야 다음으로 넘어갑니다");
        //     location.href = "https://www.google.com/";
        // });

        // -----confirm-----
        // page.on("dialog", async (dialog) => {
        //     console.log(dialog.type(), dialog.message());
        //     await dialog.accept(); // dialog.dismiss() : 취소
        // });

        // await page.evaluate(() => {
        //     if (confirm("이 창이 꺼져야 다음으로 넘어갑니다")) {
        //         location.href = "https://www.google.com/";
        //     } else {
        //         location.href = "https://www.naver.com/";
        //     }
        // });

        // -----prompt-----
        page.on("dialog", async (dialog) => {
            console.log(dialog.type(), dialog.message());
            if (dialog.message() === "첫번째 주소를 입력하세요") {
                await dialog.accept("https://www.google.com/");
            } else if (dialog.message() === "두번째 주소를 입력하세요") {
                await dialog.accept("https://www.naver.com/");
            }
        });

        await page.evaluate(() => {
            const data1 = prompt("두번째 주소를 입력하세요");
            location.href = data1;
        });
    } catch (e) {
        console.error(e);
    }
};

crawler();
