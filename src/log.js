const fs = require('fs');
const LOG_DIR = './logs';
const {format} = require('date-fns');

const Log = {
    backupToFile (data) {
        return new Promise((resolve, reject) => {
            fs.appendFile(
                `${LOG_DIR}/${format(new Date(), 'YYYY-MM-DD')}.json`,
                `${data},\r\n`,
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        })
    }
};


module.exports = Log;

