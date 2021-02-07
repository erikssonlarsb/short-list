const log4js = require('log4js');
const env = require('../environment');
const PositionDataAdapter = require('../adapters/positionDataAdapter');
const InstrumentDataAdapter = require('../adapters/instrumentDataAdapter');
const PriceDataAdapter = require('../adapters/priceDataAdapter');
const PartyFactory = require('../factories/partyFactory');
const InstrumentFactory = require('../factories/instrumentFactory');
const priceFactory = require('../factories/priceFactory');
const positionFactory = require('../factories/positionFactory');

var logger = log4js.getLogger('download positions');
logger.level = env.logLevel;

exports.run = async function(historic=false) {

  let positionsData = await PositionDataAdapter.fetchData(historic=historic);

  for (let [i, positionData] of positionsData.entries()) {
    try {
      let instrument = await InstrumentFactory.findOne({'identifiers': {$elemMatch: {id: positionData.isin, type: 'Isin'}}});

      if(!instrument) {
        /*  If the position instrument doesn't exist, create it */
        
        let issuer = await PartyFactory.findOne({name: positionData.issuer});
        if (!issuer) {
          issuer = await PartyFactory.create({name: positionData.issuer, roles: ['Issuer']});
          logger.info(`Created new party '${issuer.name}' with role 'Issuer'`);
        } else if (!issuer.roles.includes('Issuer')) {
          issuer.roles.push('Issuer');
          issuer = await PartyFactory.update(issuer._id, {roles:issuer.roles});
          logger.info(`Added role 'Issuer' to party '${issuer.name}'`);
        }

        instrumentData = await InstrumentDataAdapter.fetchData(isin=positionData.isin);

        if(!instrumentData) {
          instrument = await InstrumentFactory.create({issuer: issuer._id, status: 'Delisted', identifiers: [{id: positionData.isin, type: 'Isin'}]});
          logger.info(`Created delisted instrument with isin ${instrument.identifiers.find(identifier => identifier.type == 'Isin').id}`);
        } else {
          instrument = await InstrumentFactory.create({name: instrumentData.name, issuer: issuer._id, status: 'Active', identifiers: [{id: positionData.isin, type: 'Isin'}, {id: instrumentData.id, type: 'NasdaqId'}]});
          logger.info(`Created active instrument ${instrument.name}`);
        }
      }

      let holder = await PartyFactory.findOne({name: positionData.holder});
      if (!holder) {
        holder = await PartyFactory.create({name: positionData.holder, roles: ['Holder']});
        logger.info(`Created new party '${holder.name}' with role 'Holder'`);
      } else if (!holder.roles.includes('Holder')) {
        holder.roles.push('Holder');
        holder = await PartyFactory.update(holder._id, {roles:holder.roles});
        logger.info(`Added role 'Holder' to party '${holder.name}'`);
      }

      const firstPriceRecord = await priceFactory.findOne({type: 'Close', instrument: instrument._id}, {sort: {date: 1}});
      if(!firstPriceRecord || positionData.date < firstPriceRecord.date) {
        const nasdaqId = instrument.identifiers.find(identifier => identifier.type == 'NasdaqId')?.id;

        if(nasdaqId) {
          let toDate = firstPriceRecord ? firstPriceRecord.date.toLocaleDateString('sv-SE'): '';
          const pricesData = await PriceDataAdapter.fetchData(id=nasdaqId, fromDate=positionData.date.toLocaleDateString('sv-SE'), toDate=toDate);
          if(!pricesData) {
            logger.warn(`Could not download price history for instrument ${instrument.name}, from ${positionData.date} to ${toDate}`);
          } else {
            for (let priceData of pricesData) {
              let existingPrice = await priceFactory.findOne({type: 'Close', date: priceData.date, instrument: instrument._id});
              if (!existingPrice) {
                await priceFactory.create({value: priceData.value, type: 'Close', date:priceData.date, instrument: instrument._id});
              } else if (existingPrice.value != priceData.value) {
                logger.warn(`Detected price inconsistency for instrument ${instrument.name} on ${existingPrice.date}. Persisted value is ${existingPrice.value}, while retrived value is ${priceData.value}.`);
              }
            }
          } 
        }
      }

      let existingPosition = await positionFactory.findOne({holder: holder._id, instrument: instrument._id, date: positionData.date});
      if (!existingPosition) {
        await positionFactory.create({holder: holder._id, instrument: instrument._id, date: positionData.date, value: positionData.value});
      }
    } catch(error) {
      logger.error(`Failed to process position on row ${i+6}.`);
      logger.error(positionData);
      throw(error);
    }
  }
  logger.info("...processing finished.")
}