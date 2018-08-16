const TelegramBot = require('node-telegram-bot-api');
const token = '686305798:AAHZ0Fth1fuiZUt2d8viIHQntr6w8UmK2c4';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
const chats = [];

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

    if (!chats.find(chat => chat === chatId)) {
        chats.push(chatId);
    }

    bot.sendMessage(chatId, 'Уведомления от crmday.sipuni.com включены');
});

bot.onText(/\/end/, (msg) => {
    const chatId = msg.chat.id;
    let i = chats.indexOf(chatId);

    if (i > -1) {
        chats.splice(i, 1);
    }

    bot.sendMessage(chatId, 'Вы отписались от уведомлений crmday.sipuni.com');
});

bot.on('newContact', function(contact) {
    if (chats.length > 0) {
        chats.forEach(chatId => {
            bot.sendMessage(
                chatId,
                `Новый контакт от crmday.sipuni.com\nИмя - ${contact.name}\nТелефон - ${contact.phone}\nEmail - ${contact.email}`,
                {parse_mode: 'html'}
            )
        })
    }
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    //console.log('bot message', msg);

    // send a message to the chat acknowledging receipt of their message
    //bot.sendMessage(chatId, 'Received your message');
});

module.exports = bot;