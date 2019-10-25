function parseAmount(str) {
    const match = str.match(/(?<=^|\s|\:|\$|[a-zA-Z][\.\,]{0,1})\d+([,.]\d+){0,1}(?=$|\s)/);
    
    if (match) {
        return parseFloat(match[0].replace(/,/g, "."));
    } else {
        return NaN;
    }
}

function parseCNPJ(str) {
    const match = str.match(/(?<=^|\s)\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}(?=$|\s)/);
    
    if (match) {
        return match[0];
    } else {
        return null;
    }    
}

const loader = ` return {
    parseAmount: ${parseAmount.toString()},
    parseCNPJ: ${parseCNPJ.toString()}
};`;

module.exports = {
    parseAmount,
    parseCNPJ,
    loader
};