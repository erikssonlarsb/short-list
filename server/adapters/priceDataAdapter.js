const log4js = require('log4js');
const logger = log4js.getLogger(require("path").basename(__filename, '.js'));
const fetch = require('node-fetch');
const baseUrl = 'http://www.nasdaqomxnordic.com/webproxy/DataFeedProxy.aspx?';


class PriceData {
    constructor(data) {
        this.date = new Date(data[0]);
        this.value = data[1];
    }
}

async function fetchData(id, fromDate, toDate) {
    const priceSearchParams = new URLSearchParams({SubSystem: 'History', Action: 'GetChartData', json: '1', timezone: 'CET', Instrument: id, FromDate: fromDate, ToDate: toDate});
    const response = await fetch(baseUrl + priceSearchParams, {headers: {'Accept': '*/*', 'User-Agent': 'shortlist/0.1', 'Connection': 'keep-alive'}})
    .then(response => response.json())
    .catch(error => logger.error(error));

    if(!response['data']) {
        return null;
    } else {
        return response.data[0].chartData.cp.map(price => new PriceData(price));
    }
}

module.exports = {
    fetchData: fetchData
};