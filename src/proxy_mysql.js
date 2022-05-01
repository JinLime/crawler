const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const db = require("./models");
dotenv.config();

const crawler = async () => {
    await db.sequelize.sync();
    try {
        let browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === "production",
            args: ["--window-size=1920,1080"],
        });
        let page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
        });
        await page.goto("https://spys.one/free-proxy-list/KR/");
        const proxies = await page.evaluate(() => {
            const ips = Array.from(document.querySelectorAll("tr > td:first-of-type > .spy14")).map(
                (v) => v.textContent.replace(/document\.write\(.+\)/, ""),
            ); // IP
            const types = Array.from(document.querySelectorAll("tr > td:nth-of-type(2)"))
                .slice(5)
                .map((v) => v.textContent); // Proxy type
            const latencies = Array.from(
                document.querySelectorAll("tr > td:nth-of-type(6) > .spy1"),
            ).map((v) => v.textContent); // Latency
            return ips.map((v, i) => {
                return {
                    ip: v,
                    type: types[i],
                    latency: latencies[i],
                };
            });
        });

        console.log(proxies);

        const filtered = proxies
            .filter((v) => v.type.startsWith("HTTP"))
            .sort((a, b) => a.latency - b.latency);

        // DB에 ip 중복인지 체크
        const exist = await db.Proxy.findOne({
            where: {
                ip: filtered.ip,
            },
        });
        if (!exist) {
            // DB에 저장
            await Promise.all(
                filtered.map((v) => {
                    return db.Proxy.create({
                        ip: v.ip,
                        type: v.type,
                        latency: v.latency,
                    });
                }),
            );
        }

        // console.log(filtered);
        await page.close();
        await browser.close();

        browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === "production",
            args: [
                "--window-size=1920,1080",
                // "--ignore-certificate-errors",
                // `--proxy-server=${filtered[0].ip}`,
            ],
        });

        const context = await browser.createIncognitoBrowserContext(); // 시크릿 브라우저
        console.log(await browser.browserContexts());

        secretPage = await context.newPage();

        await secretPage.setViewport({
            width: 1920,
            height: 1080,
        });

        await secretPage.goto("https://google.com");
        await db.sequelize.close();
    } catch (e) {
        console.error(e);
    }
};

crawler();
