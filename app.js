'use strict';
const express = require('express'); // app server
const bodyParser = require('body-parser'); // parser for post requests
const cookieParser = require('cookie-parser');
const compression = require('compression');
const fileUpload = require('express-fileupload');
const loginApplication = require('./src/application/login');
const videoApplication = require('./src/application/video');
const fs = require('fs');
const app = express();

app.use(compression({ level: 9, memLevel: 9 })); // Gzip圧縮
app.use(bodyParser.json()); // HTTP body部をjsonとして解釈しrequest.bodyに設定
app.use(bodyParser.urlencoded({ extended: false })); // 拡張構文対応は不要
app.use(cookieParser());
app.use(express.static('output')); // リソース外部公開設定

////// エンドポイント処理 //////

app.get('/api/login', loginApplication.login);
app.post('/api/analysis', loginApplication.analysis);
app.post('/api/videoanalysis', videoApplication.analysis);

app.use(fileUpload());
app.post('/api/upload', videoApplication.upload);

// どのパスにも該当しなかった場合はindex.htmlを応答する
app.use((req, res) => {
	fs.readFile("output/index.html", (err, data) => {
		res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
		res.end(data);
	});
});

module.exports = app;
