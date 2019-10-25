function scrap(helpersLoader) {
    const helpers = Function(helpersLoader)();

    const output = {
        emitter: {
            name: undefined,
            cnpj: undefined
        },

        items: undefined,
        total: undefined
    };

    output.items = Array.prototype.map.call(document.getElementById("tabResult").tBodies[0].children, (item) => {
        return {
            item: item.querySelector(".txtTit").textContent.trim(),
            quantity: helpers.parseAmount(item.querySelector(".Rqtd").childNodes[2].textContent),
            unit: item.querySelector(".RUN").childNodes[2].textContent.trim(),
            unitCost: helpers.parseAmount(item.querySelector(".RvlUnit").childNodes[2].textContent),
            totalCost: helpers.parseAmount(item.querySelector(".txtTit > .valor").textContent)
        };
    });

    output.total = helpers.parseAmount(document.querySelector("#totalNota .totalNumb.txtMax").textContent.replace(/,/g, "."));
    
    const emitterInfo = document.querySelector("#conteudo > .txtCenter > .txtTopo").parentElement;
    output.emitter.name = emitterInfo.querySelector(".txtTopo").textContent.trim();
    output.emitter.cnpj = helpers.parseCNPJ(emitterInfo.querySelector(".txtTopo").nextElementSibling.textContent);
    output.emitter.address = emitterInfo.querySelector(".txtTopo").nextElementSibling.nextElementSibling.textContent.replace(/[\n\t]/g, "").trim();

    return output;
}

scrap.sites = [
    "http://app.sefaz.es.gov.br/ConsultaNFCe/qrcode.aspx"
];

module.exports = scrap;