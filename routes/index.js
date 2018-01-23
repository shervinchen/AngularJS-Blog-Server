var express = require('express');
var router = express.Router();

var fs = require('fs');
var marked = require('marked');
var hljs = require('highlight.js');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});

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
