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
	// 每页显示文章数
	var pagePostCount = 5;
	// 取得当前页数
	var page = req.query.page;
	var postDatas = require('../data/post.json').reverse();
	fs.readdir("markdown/", function(err, files) {
		var postPos = (page - 1) * pagePostCount;
		postDatas = postDatas.slice(postPos, postPos + pagePostCount);
		files = files.reverse().slice(postPos, postPos + pagePostCount);
		files.forEach(function(file, index) {
			fs.readFile('markdown/'+file, function(err, data) {
				postDatas[index].postContent = marked(data.toString());
				// console.log(postDatas[index]);
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