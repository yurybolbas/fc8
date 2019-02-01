var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017';
const dbname = 'mynews';

mongoose.connect(`${url}/${dbname}`, {useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
	id: String,
	source: {
		id: String,
		name: String
	},
	author: String,
	title: String,
	description: String,
	url: String,
	urlToImage: String,
	publishedAt: Date,
	content: String
});

const Articles = mongoose.model('Article', articleSchema);

Articles.findById(id, (err, Article) => {});



/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {title: 'Express'});
});

router.get('/news', function (req, res, next) {
	let url = path.resolve(__dirname, '../top-headlines.json');
	fs.readFile(url, 'utf-8', (err, content) => {
		if (err) {
			next(err);
			return;
		}
		content = JSON.parse(content);
		res.json(content);
	});

});

router.get('/news/:id', function (req, res, next) {
	let url = path.resolve(__dirname, '../top-headlines.json');
	fs.readFile(url, 'utf-8', (err, content) => {
		if (err) {
			next(err);
			return;
		}
		content = JSON.parse(content);
		let result = content.articles.filter(el => {
			return el.id == req.params.id;
		});
		res.json(result[0]);
	});

});

router.post('/news', function (req, res, next) {
	let url = path.resolve(__dirname, '../top-headlines.json');
	fs.readFile(url, 'utf-8', (err, content) => {
		if (err) {
			next(err);
			return;
		}
		content = JSON.parse(content);
		content.articles.push(req.body);
		// res.json(result[0]);
		fs.writeFile(url, JSON.stringify(content), 'utf-8', () => {
			res.sendStatus(200);
		});
	});

});

router.put('/news/:id', function (req, res, next) {
	let url = path.resolve(__dirname, '../top-headlines.json');
	fs.readFile(url, 'utf-8', (err, content) => {
		if (err) {
			next(err);
			return;
		}
		content = JSON.parse(content);
		let result = content.articles.findIndex(el => {
			return el.id == req.params.id;
		});
		content.articles[result] = req.body;
		fs.writeFile(url, JSON.stringify(content), 'utf-8', () => {
			res.sendStatus(200);
		});

	});

});

router.delete('/news/:id', function (req, res, next) {
	let url = path.resolve(__dirname, '../top-headlines.json');
	fs.readFile(url, 'utf-8', (err, content) => {
		if (err) {
			next(err);
			return;
		}
		content = JSON.parse(content);
		let result = content.articles.findIndex(el => {
			return el.id == req.params.id;
		});
		console.log(result);
		if (result == -1) {
			console.log("no element");
		}
		// content.articles[result] = req.body;
		content.articles.splice(result, 1);
		fs.writeFile(url, JSON.stringify(content), 'utf-8', () => {
			res.sendStatus(200);
		});

	});

});

module.exports = router;
