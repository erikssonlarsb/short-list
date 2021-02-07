const log4js = require('log4js');
const fetch = require('node-fetch');
const env = require('../environment');

const baseUrl = 'http://www.nasdaqomxnordic.com/webproxy/DataFeedProxy.aspx?';
var logger = log4js.getLogger('instrumentDataAdapter');
logger.level = env.logLevel;

class InstrumentData {
    constructor(data) {
        this.id = data['@id'];
        this.name = data['@fnm'];
    }
}

async function fetchData(isin) {
    const instrumentSearchParams = new URLSearchParams({SubSystem: 'Prices', Action: 'Search', json: '1', InstrumentISIN: isin});
    const response = await fetch(baseUrl + instrumentSearchParams, {headers: {'Accept': '*/*', 'User-Agent': 'shortlist/0.1', 'Connection': 'keep-alive'}})
    .then(response => response.json())
    .catch(error => logger.error(error));
    
    if(!response['inst']) {
        return null;
    } else if(response['inst'] instanceof Array) {
        response['inst'].forEach(function(inst, i) {
        if(inst['@cr'] == 'SEK') {
            return new InstrumentData(response['inst'][i]);
        }
        });
    } else {
        return new InstrumentData(response['inst']);
    }
}

module.exports = {
    fetchData: fetchData
};