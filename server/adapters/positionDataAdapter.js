const log4js = require('log4js');
const fetch = require('node-fetch');
const xlsx = require('xlsx');
const env = require('../environment');

const baseUrl = 'https://www.fi.se/en/our-registers/net-short-positions/';
var logger = log4js.getLogger('positionDataAdapter');
logger.level = env.logLevel;

class PositionData {
    constructor(data) {
        this.holder = data['holder'];
        this.issuer = data['issuer'];
        this.isin = data['isin'];
        this.value = isNaN(data['value'].replace(',', '.')) ? 0 : parseFloat(data['value'].replace(',', '.'));
        this.date = new Date(data['date']);
        this.comment = data['comment'];
    }
}

async function fetchData(historic = false) {
    let url = baseUrl + (historic ? 'GetHistFile' : 'GetAktuellFile');
    var wb = xlsx.read(await fetch(url).then(response => response.buffer()), {type:'buffer'});
    var ws = wb.Sheets[wb.SheetNames[0]];
    let positions = xlsx.utils.sheet_to_json(ws, {raw: false, range:6, header: ['holder', 'issuer', 'isin', 'value', 'date', 'comment']});
    return positions.map(position => new PositionData(position));
}

module.exports = {
    fetchData: fetchData
};