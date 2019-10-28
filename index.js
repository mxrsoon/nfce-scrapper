const puppeteer = require("puppeteer-core");
const scrappers = require("./scrappers");
const helpers = require("./helpers");

let browser;

async function init(options) {
    if (!browser || !browser.isConnected()) {
        options = Object.assign({}, options);
        
        if (!options.executablePath) {
            if (options.chromiumRev) {
                const fetcher = puppeteer.createBrowserFetcher();
                const revInfo = await fetcher.download(options.chromiumRev);
                options.executablePath = revInfo.executablePath;
            } else {
                throw new Error("Must specify chromium executable path or revision to download");
            }
        }

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
    if (browser) {
        await browser.close();
        browser = undefined;
    }
}

async function evaluateOnPage(url, func, timeout, ...args) {
    if (browser) {
        const page = await browser.newPage();
        await page.goto(url, { timeout, waitUntil: "domcontentloaded" });

        const result = await page.evaluate(func, ...args);
        await page.close();

        return result;
    } else {
        throw new Error("Must call .init() first");
    }
}

async function main() {
    if (process.argv.length === 4) {
        console.log("Setting Chromium up... This may take a while.");
        await init({ chromiumRev: process.argv[3] });

        const startTime = Date.now();
        console.log("Scrapping... Please, wait.\n")
        console.log(await scrap(process.argv[2]));
        console.log(`\nSpent ${Date.now() - startTime}ms scrapping.`);
        
        await dispose();

        console.warn("Still running. Please, manually close.")
        process.stdin.resume();
    } else {
        throw new Error("Missing parameters: must pass QRCode's URL and Chromium revision to use");
    }
}

if (!module || !module.parent) {
    return main();
}

module.exports = {
    init,
    scrap,
    dispose
};