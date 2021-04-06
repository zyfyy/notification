var express = require('express');
const webPush = require('web-push');
var app = express();


if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.log(
        'You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY ' +
            'environment variables. You can use the following ones:'
    );
    console.log(webPush.generateVAPIDKeys());
    return;
}
// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
    'http://localhost:30023/',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

app.use(express.static('./static'));

app.get('/vapidPublicKey', function (req, res) {
    res.send(process.env.VAPID_PUBLIC_KEY);
});

app.post('/register', function (req, res) {
    // A real world application would store the subscription info.
    res.sendStatus(201);
});
const payloads = {};

app.post('/sendNotification', express.json(), function (req, res) {
    const subscription = req.body.subscription;
    const payload = req.body.payload;
    const options = {
        TTL: req.body.ttl
    };

    setTimeout(function () {
        payloads[req.body.subscription.endpoint] = payload;
        webPush
            .sendNotification(subscription, payload, options)
            .then(function () {
                res.sendStatus(201);
            })
            .catch(function (error) {
                console.log(error);
                res.sendStatus(500);
            });
    }, req.body.delay * 1000);
});

app.get('/getPayload', function (req, res) {
    res.send(payloads[req.query.endpoint]);
});


var port = parseInt(process.env.PORT, 10) || 3003;
var ready = new Promise(function willListen(resolve, reject) {
    app.listen(port, function didListen(err) {
        if (err) {
            reject(err);
            return;
        }
        console.log('app.listen on http://localhost:%d', port);
        resolve();
    });
});

exports.ready = ready;
exports.app = app;
