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
	Article.find({} ,(err, result) => {
			if (err) {
				next(err);
			}
			console.log(result);
	})
	.then(() => {
		res.sendStatus(200);
	});
});

router.get('/news/:id', function (req, res, next) {
  console.log(req.params.id);
	Article.findOne({id: req.params.id}, (err, result) => {
			if (err) {
				next(err);
			}
			console.log(result);
	})
	.then(() => {
		res.sendStatus(200);
	});
});

router.post('/news', function (req, res, next) {
	newContent = req.body;
	Article.create(newContent, (err, result) => {
			if (err) {
				next(err);
			}
			console.log(result);
	})
	.then(() => {
		res.sendStatus(200);
	});
});

router.put('/news/:id', function (req, res, next) {
	console.log(req.params.id);
	Article.findOneAndUpdate({id: req.params.id}, { 'source.name': 'Edited ABC News' }, (err, result) => {
			if (err) {
				next(err);
			}
			console.log(result);
	})
	.then(() => {
		res.sendStatus(200);
	});
});

router.delete('/news/:id', function (req, res, next) {
	console.log(req.params.id);
	Article.findOneAndDelete({ id: req.params.id }, (err) => {});
});

module.exports = router;
