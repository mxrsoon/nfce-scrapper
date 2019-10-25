module.exports = {
    es: require("./es")
};

const sites = {};

for (let prop in module.exports) {
    if (module.exports.hasOwnProperty(prop)) {
        for (let site of module.exports[prop].sites) {
            sites[site] = module.exports[prop];
        }
    }
}

module.exports.sites = sites;