const TelegramBot = require('node-telegram-bot-api');
const {saveChat, deleteChat, getChats} = require('./models');
const token = '686305798:AAHZ0Fth1fuiZUt2d8viIHQntr6w8UmK2c4';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    console.log('bot echo', msg);
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    saveChat(chatId).then(saved => {
        if (saved) {
            bot.sendMessage(chatId, 'Уведомления от crmday.sipuni.com включены');
        }
    });
});

bot.onText(/\/end/, (msg) => {
    const chatId = msg.chat.id;

    deleteChat(chatId).then(deleted => {
        if (deleted) {
            bot.sendMessage(chatId, 'Вы отписались от уведомлений crmday.sipuni.com');
        }
    });
});

bot.on('newContact', function(contact) {
    getChats().then(chats => {
        if (chats.length > 0) {
            chats.forEach(chatId => {
                let str = `
<b>Новый контакт от crmday.sipuni.com</b>
${contact.name && `Имя - ${contact.name}`}
${contact.phone && `Телефон - ${contact.phone}`}
${contact.email && `Email - ${contact.email}`}
`;
                bot.sendMessage(chatId, str, {parse_mode: 'HTML'})
            });
        }
    });
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {

    //console.log('bot message', msg);

    // send a message to the chat acknowledging receipt of their message
    //bot.sendMessage(chatId, 'Received your message');
});

module.exports = bot;