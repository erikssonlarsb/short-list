const environment = process.env.ENV || 'dev';
const logLevel = process.env.LOG_LEVEL || 'debug';
const dbURL = process.env.DB_URL || 'localhost:27017';
const dbName = process.env.DB_NAME || 'shortlist';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || 'rootPassword';
const serverPort = process.env.PORT || 3000;


module.exports = {
    environment: environment,
    logLevel: logLevel,
    dbURL: 'mongodb://' + dbURL,
    dbName: dbName,
    dbUser: dbUser,
    dbPassword: dbPassword,
    serverPort: serverPort
}