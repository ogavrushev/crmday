const express = require('express');
const bodyParser = require('body-parser');
const db = require('./src/db');
const log = require('./src/log');
const PORT = process.env.PORT;
const {format} = require('date-fns');
const mail = require('./src/mail');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/check', async (req, res) => {
    if (req.query.auth === 'Uk$isa@' && req.query.date) {
        let data = await db.lrangeAsync(req.query.date, 0, -1);

        if (data.length > 0) {
            data = data.map(contact => JSON.parse(contact));
        }

        return res.json({ contacts: data });
    }

    res.json({check: 1});
});

app.post('/save', async (req, res) => {

    try {
        req.body.date = format(new Date(), 'YYYY-MM-DD');
        const body = JSON.stringify(req.body);

        log
            .backupToFile(body)
            .catch(() => {
                console.log('failed to write file' , req.body);
            });

         let saved = await db.rpushAsync(req.body.date, body);

         mail('olga.greyl@sipuni.com', req.body).catch(err => {
             console.log('mail sent error', err.message);
         });

         if (saved) {
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


