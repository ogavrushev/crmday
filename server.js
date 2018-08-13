const express = require('express');
const bodyParser = require('body-parser');
const db = require('./src/db');
const PORT = process.env.PORT;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/check', async (req, res) => {
    let data = await db.getAsync('f52d4qs60tc0');
    res.json({check: JSON.parse(data)});
});

app.post('/save', async (req, res) => {
     try {
         let saved = await db.setAsync(req.body.key, JSON.stringify(req.body));

         if (saved) {
             res.json({saved: true, key: req.body.key});
         }

     } catch (e) {
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


