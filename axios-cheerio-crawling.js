const { parse } = require("csv-parse/sync");
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

records.forEach((v, i) => {
    console.log(i, v);
});

const crawler = async () => {
    /*
    // sync (순서대로)
    for (const [i, v] of records.entries()) {
        const response = await axios.get(v[1]);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            const text = $(".score.score_left .star_score").text();
            console.log(v[0], "평점 :", text.trim());
        }
    }
    */

    // async (요청오는대로)
    await Promise.all(
        records.map(async (v) => {
            const response = await axios.get(v[1]);
            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);
                const text = $(".score.score_left .star_score").text();
                console.log(v[0], "평점 :", text.trim());
            }
        }),
    );
};

crawler();
