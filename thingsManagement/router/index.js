var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')

var thing = require('./thing/index')

router.get('/', function(req,res) {
	var id = req.user;
	('thing.ejs', {'id' : id});
});

router.use('/thing', thing)

module.exports = router;

