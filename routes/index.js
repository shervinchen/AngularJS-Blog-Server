var express = require('express');
var router = express.Router();

var marked = require('marked');
var fs = require('fs');

router.get('/', function(req, res, next) {
	fs.readFile('markdown/README.md', function(err, data) {
		var html = marked(data.toString());
		res.send(html);
	});
});

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
