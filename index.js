const puppeteer = require("puppeteer");
const scrappers = require("./scrappers");
const helpers = require("./helpers");

let browser;

async function init(options) {
    if (!browser || !browser.isConnected()) {
        browser = await puppeteer.launch(options);
    }
}

async function scrap(url, timeout = 0) {
    url = url instanceof URL ? url : new URL(url);
    const site = `${url.origin}${url.pathname}`;

    if (site in scrappers.sites) {
        return await evaluateOnPage(url, scrappers.sites[site], timeout, helpers.loader);
    } else {
        throw new Error("Unknown site (not supported)");
    }
}

async function dispose() {
    if (browser && browser.isConnected()) {
        await browser.close();
        browser = undefined;
    }
}

async function evaluateOnPage(url, func, timeout, ...args) {
    const currentBrowser = browser || await puppeteer.launch();
    
    const page = await currentBrowser.newPage();
    page.setDefaultNavigationTimeout(0);
    page.setDefaultTimeout(0);
    await page.goto(url, { timeout, waitUntil: "domcontentloaded" });

    const result = await page.evaluate(func, ...args);
    await page.close();

    if (currentBrowser !== browser) {
        await currentBrowser.close();
    }

    return result;
}

async function main() {
    const startTime = Date.now();
    console.log(await scrap(process.argv[2]));
    console.log(`\nSpent ${Date.now() - startTime}ms scrapping.`);
    console.warn("Still running. Please, manually close.")
    process.stdin.resume();
}

if (!module || !module.parent) {
    return main();
}

module.exports = {
    init,
    scrap,
    dispose
};