const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis);

const sub = redis.createClient({password: 'x6KgzH+tvc8Z4SjsfXDJoH3An5vmJO0VpA56Xg8ZPjijk4zCG1sRWr5s3xg2ksskxnsv9lVtryz9dYm5root'});

sub.on('error', err => {
    console.log('Subscriber error: ', err.message);
});

sub.on('ready', () => {
    console.log('Subscriber connected, ready to use');
});

sub.on('end', () => {
    console.log('Subscriber connection closed');
});

module.exports = sub;

