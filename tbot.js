const bot = require('./src/tbot');
const subscriber = require('./src/subscriber');

subscriber.subscribe('newContact');

subscriber.on('message', (channel, message) => {
    console.log('tbot:message:received', channel, message);
    if (channel === 'newContact') {
        try {
            let contact = JSON.parse(message);
            bot.emit(channel, contact);
        } catch (e) {
            console.log(`tbot:error:parse_message ${e.message}, data: ${message}`);
        }
    }
});