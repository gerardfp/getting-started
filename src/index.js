const express = require('express');
const app = express();
const db = require('./mysql');

app.use(require('body-parser').json());
app.use(express.static(__dirname + '/static'));

app.get('/postits', async (req, res) => {
    const items = await db.getItems();
    res.send(items);
});

app.post('/postits', async (req, res) => {
    const item = {
        id: uuid(),
        name: req.body.name,
        completed: false,
    };

    await db.storeItem(item);
    res.send(item);
});


db.init().then(() => {
    app.listen(3000, () => console.log('Listening on port 3000'));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
