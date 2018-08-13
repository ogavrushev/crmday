const fs = require('fs');
const LOG_CONTACTS_PATH = './logs/contacts.json';
const Log = {
    backupToFile (data) {
        return new Promise((resolve, reject) => {
            fs.appendFile(
                LOG_CONTACTS_PATH,
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

