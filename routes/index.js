var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

var bluebird = require("bluebird");
const mongoose = require('mongoose');
mongoose.Promise = bluebird.Promise;
const url = 'mongodb://localhost:27017';
const dbname = 'fc8';

mongoose.connect(`${url}/${dbname}`, {useNewUrlParser: true});

// mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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

var collectionName = 'articles';
const Article = mongoose.model('Article', articleSchema, collectionName);

router.get('/news', function (req, res, next) {
	console.log(req.method);
	Article.find({} ,(err, result) => {
		console.log(result);
		if (!result) {
				next(err);
				return;
			}
	})
	.then((result) => {
		res.send(result);
	});
});

router.get('/news/:id', function (req, res, next) {
  console.log(req.params.id);
	Article.findOne({id: req.params.id}, (err, result) => {
		console.log(result);
		if (!result) {
				next(err);
				return;
			}
	})
	.then((result) => {
		if (result) {
			res.send(result);
		}
	});
});

router.post('/news', function (req, res, next) {
	newContent = req.body;
	Article.create(newContent, (err, result) => {
		console.log(result);
		if (!result) {
				next(err);
				return;
			}
			res.send(newContent);
	})
	;
});

router.put('/news/:id', function (req, res, next) {
	console.log(req.params.id);
	Article.findOneAndUpdate({id: req.params.id}, { 'source.name': 'Edited ABC News' }, (err, result) => {
		console.log(result);
		if (!result) {
				next(err);
				return;
			}
	})
	.then((result) => {
		if (result) {
			res.send(result);
		}
	});
});

router.delete('/news/:id', function (req, res, next) {
	console.log(req.params.id);
	Article.findOneAndDelete({ id: req.params.id }, (err) => {
		if (err) {
			next(err);
			return;
		}
})
	.then(() => {
		res.sendStatus(200);
	});
});

module.exports = router;
