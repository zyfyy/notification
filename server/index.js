const app = require('../api');

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
