const http = require('http');
const https = require('https');
const Koa = require('koa');
const app = new Koa();
const fs = require('fs');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');

var options = {
    key: fs.readFileSync('./ssl/privatekey.pem'),
    cert: fs.readFileSync('./ssl/certificate.pem')
};

app.use(bodyParser({
    formLimit: '64mb',
    jsonLimit: '64mb',
    textLimit: '64mb'
}));

app.use(serve(__dirname + '/public'));

// 在端口3000监听:
http.createServer(app.callback()).listen(3700, function() {
    console.log('http server listening at port 3700...');
});
https.createServer(options, app.callback()).listen(3701, function() {
    console.log('https server listening at port 3701...');
});