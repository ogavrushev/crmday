const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis);

const db = redis.createClient({password: 'x6KgzH+tvc8Z4SjsfXDJoH3An5vmJO0VpA56Xg8ZPjijk4zCG1sRWr5s3xg2ksskxnsv9lVtryz9dYm5root'});

db.on('error', err => {
    console.log('Redis error: ', err.message);
});

db.on('ready', () => {
   console.log('Redis connected, ready to use');
});

db.on('end', () => {
   console.log('Redis connection closed');
});

module.exports = db;

