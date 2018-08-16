const db = require('./db');
const log = require('./log');

module.exports = {
    saveContact: async function (body) {
        log
            .backupToFile(body)
            .catch(() => {
                console.log('failed to write file' , body);
            });

        return await db.rpushAsync(body.date, JSON.stringify(body));
    },

    getContacts: async function (filter) {
        let data = await db.lrangeAsync(filter, 0, -1);

        if (data.length > 0) {
            data = data.map(contact => JSON.parse(contact));
        }

        return data;
    }
};