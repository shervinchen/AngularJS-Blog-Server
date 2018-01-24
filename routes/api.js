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
    xhtml: false,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
});

/*
 * 文章列表数据
 */
exports.postlist = function (req, res) {
	var postDatas = require('../data/post.json');
	fs.readdir("markdown/", function(err, files) {
		files.forEach(function(file, index) {
			fs.readFile('markdown/'+file, function(err, data) {
				postDatas[index].postContent = marked(data.toString());
			});
		});
		res.send(postDatas);
	});
};

/*
 * 文章数据
 */
exports.post = function (req, res) {
	var id = req.query.postId;
	var postDatas = require('../data/post.json');
	fs.readFile('markdown/'+id+'.md', function(err, data) {
		postDatas[id-1].postContent = marked(data.toString());
		res.json(postDatas[id-1]);
	});
};