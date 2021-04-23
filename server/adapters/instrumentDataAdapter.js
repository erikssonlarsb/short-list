const log4js = require('log4js');
const logger = log4js.getLogger(require("path").basename(__filename, '.js'));
const fetch = require('node-fetch');
const baseUrl = 'http://www.nasdaqomxnordic.com/webproxy/DataFeedProxy.aspx?';


class InstrumentData {
    constructor(data) {
        this.id = data['@id'];
        this.name = data['@fnm'];
    }
}

async function fetchData(isin) {
    const instrumentSearchParams = new URLSearchParams({SubSystem: 'Prices', Action: 'Search', json: '1', InstrumentISIN: isin});
    return await fetch(baseUrl + instrumentSearchParams, {headers: {'Accept': '*/*', 'User-Agent': 'shortlist/0.1', 'Connection': 'keep-alive'}})
    .then(async response => {
        return await response.json().catch(error => {
            logger.error("Response status: " + response.status);
            logger.error("Response body: " + response.text());
            throw(error);
        })
    })
    .then(json => {
        if(!json.inst) {
            return null;
        } else if(json.inst instanceof Array) {
            json.inst.forEach(function(inst, i) {
                if(inst['@cr'] == 'SEK') {
                    return new InstrumentData(json.inst[i]);
                }
            });
        } else {
            return new InstrumentData(json.inst);
        }
    })
    .catch(error => {
        logger.error(error);
        return null;
    });
}

module.exports = {
    fetchData: fetchData
};