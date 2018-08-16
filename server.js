const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
const {format} = require('date-fns');
const models = require('./src/models');
const bot = require('./src/tbot');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/check', (req, res) => {
    let data = [];

    if (req.query.auth === 'Uk$isa@' && req.query.date) {
        data = models.getContacts(req.query.date);
    }

    res.json({check: data});
});

app.post('/save', (req, res) => {

    try {
        req.body.date = format(new Date(), 'YYYY-MM-DD');
        let saved = models.saveContact(req.body);

        if (saved) {
            bot.emit('newContact', req.body);
            res.json({saved: true, key: req.body.key});
        }

     } catch (e) {
         console.log('save contact failed - ', req.body);
         res.json({saved: false, error: e.message});
     }
});

app.use((req, res) => { res.status(404).json({error: 404}); });

app.listen(PORT, () => {
    console.log(`App listening port ${PORT}`);
});

process.on('SIGINT', () => {
    console.log(`App shutdown on port ${PORT}`)
});


