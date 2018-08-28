const db = require('./db');
const log = require('./log');

module.exports = {

    /**
     * Save telegram chat id
     * @param id
     * @return {Promise<boolean>}
     */
    saveChat: async function (id) {
        let saved = false;

        try {
            saved = await db.saddAsync('bot:crmday:chat', id);
        } catch (e) {
            console.log('error:models:saveChat', e.message)
        }

        return saved;
    },

    /**
     * Get subscribed chats
     * @return {Promise<Array>}
     */
    getChats: async function () {
        let chats = [];

        try {
            chats = await db.smembersAsync('bot:crmday:chat');
        } catch (e) {
            console.log('error:models:getChats', e.message);
        }

        return chats;
    },

    /**
     * Delete chat
     * @param id
     * @return {Promise<boolean>}
     */
    deleteChat: async function (id) {
        let deleted = false;

        try {
            deleted = await db.sremAsync('bot:crmday:chat', id);
        } catch (e) {
            console.log('error:models:deleteChat', e.message);
        }

        return deleted;
    },

    /**
     * Save contact to db/file
     * @param body
     * @return {Promise<boolean>}
     */
    saveContact: async function (body) {
        let saved = false;
        let contact = JSON.stringify(body);

        try {
            saved = await db.rpushAsync(body.date, contact);
            db.publish('newContact', contact);
        } catch (e) {
            console.log('error:models:saveContact', e.message);
        }

        this.saveContactToFile(body);

        return saved;
    },

    saveContactToFile: function(body) {
        log
            .backupToFile(body)
            .catch(() => {
                console.log('failed to write file', body);
            });
    },

    getContacts: async function (filter) {
        let data = await db.lrangeAsync(filter, 0, -1);

        if (data.length > 0) {
            data = data.map(contact => JSON.parse(contact));
        }

        return data;
    }
};