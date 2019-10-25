const puppeteer = require("puppeteer");
let browser;

function getData() {
    function parseAmount(str) {
        return parseFloat(str.replace(/,/g, "."));
    }

    const items = Array.prototype.map.call(document.getElementById("tabResult").tBodies[0].children, (item) => {
        return {
            item: item.querySelector(".txtTit").textContent,
            quantity: parseAmount(item.querySelector(".Rqtd").childNodes[2].textContent),
            unit: item.querySelector(".RUN").childNodes[2].textContent,
            unitaryPrice: parseAmount(item.querySelector(".RvlUnit").childNodes[2].textContent),
            price: parseAmount(item.querySelector(".txtTit > .valor").textContent)
        };
    });

    const total = parseFloat(document.querySelector("#totalNota .totalNumb.txtMax").textContent.replace(/,/g, "."));

    return {
        items,
        total
    };
}

async function init(options) {
    if (!browser || !browser.isConnected()) {
        browser = await puppeteer.launch(options);
    }
}

async function scrap(url, timeout = 0) {
    const currentBrowser = browser || await puppeteer.launch();
    const page = await currentBrowser.newPage();
    await page.goto(url, { timeout, waitUntil: "domcontentloaded" });

    const result = await page.evaluate(getData);
    await page.close();

    if (currentBrowser !== browser) {
        await currentBrowser.close();
    }

    return result;
}

async function dispose() {
    if (browser && browser.isConnected()) {
        await browser.close();
        browser = undefined;
    }
}

module.exports = {
    init,
    scrap,
    dispose
};