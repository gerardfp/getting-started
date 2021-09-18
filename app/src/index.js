const express = require('express');
const app = express();
const db = require('./mysql');
const uuid = require('uuid/v4');

app.use(require('body-parser').json());
app.use(express.static(__dirname + '/static'));

app.get('/postits', async (req, res) => {
    const postits = await db.getPostits();
    res.send(postits);
});

app.post('/postits', async (req, res) => {
    const postit = {
        id: uuid(),
        value: req.body.value,
    };

    await db.storePostit(postit);
    res.send(postit);
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
