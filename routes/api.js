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
	highlight: function (code, lang) {
		if (lang && hljs.getLanguage(lang)) {
		  try {
		    return hljs.highlight(lang, code).value;
		  } catch (err) {}
		}
		try {
		  return hljs.highlightAuto(code).value;
		} catch (err) {}
		return '';
	}
});

function copyArr(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
		res.push(arr[i]);
    }
    return res;
}

/*
 * 文章列表数据
 */
exports.postlist = function(req, res) {
	// 每页显示文章数
	var perPageCount = 5;
	// 取得当前页数
	var page = req.query.page;
	// 文件夹路径
	var fileDirectory = "markdown/";
	// 获取文章数据
	var postDatas = copyArr(require('../data/post.json'));
	// 求出当前页的起始文章位置
	var postPos = (page - 1) * perPageCount;
	// 将文章数据倒序
	postDatas.reverse();
	// 截取要显示的文章数据
	postDatas = copyArr(postDatas.slice(postPos, postPos + perPageCount));
	// 判断文件夹路径是否存在
	if (fs.existsSync(fileDirectory)) {
		fs.readdir(fileDirectory, function(err, files) {
			if (err) { console.log(err); return; }
			files.reverse();
			files = copyArr(files.slice(postPos, postPos + perPageCount));
			files.forEach(function(filename, index) {
				fs.readFile(fileDirectory + filename, function(err, data) {
					if (err) throw err;
					var splitData = data.toString().split('<!--more-->')[0];
					postDatas[index].postContent = marked(splitData);
					if (index === files.length - 1) {
						res.send(postDatas);
					}
				});
			});
		});
	} else { console.log(fileDirectory + "  Not Found!"); }
};

/*
 * 文章数量
 */
exports.postcount = function(req, res) {
	// 获取文章数据
	var postDatas = copyArr(require('../data/post.json'));
	var data = {};
	data.postcount = postDatas.length;
	// 返回文章数量
	res.send(data);
};

/*
 * 文章数据
 */
exports.post = function(req, res) {
	var id = req.query.postId;
	var postDatas = require('../data/post.json');
	fs.readFile('markdown/'+id+'.md', function(err, data) {
    	if (err) throw err;
		marked(data.toString(), function(err, content) {
			if (err) throw err;
			postDatas[id-1].postContent = content;
			res.json(postDatas[id-1]);
		});
	});
	// var data = '';
	// // 创建可读流
	// var readerStream = fs.createReadStream('markdown/'+id+'.md');
	// // 设置编码为 utf8。
	// readerStream.setEncoding('UTF8');
	// // 处理流事件 --> data, end, and error
	// readerStream.on('data', function(chunk) {
	// 	data += chunk;
	// });
	// readerStream.on('end',function(){
	// // postDatas[id-1].postContent = marked(data);
	// // res.json(postDatas[id-1]);
	// 	marked(data, function (err, content) {
	// 		if (err) throw err;
	// 		postDatas[id-1].postContent = content;
	// 		res.json(postDatas[id-1]);
	// 	});
	// });
	// readerStream.on('error', function(err){
	// 	console.log(err.stack);
	// });
};

/*
 * 最新文章
 */
exports.postrecent = function(req, res) {
	// 获取文章数据
	var postDatas = copyArr(require('../data/post.json'));
	// 将文章数据倒序
	postDatas.reverse();
	// 显示的最新文章数
	var postRecentCount = 10;
	// 截取要显示的文章数据
	postDatas = copyArr(postDatas.slice(0, postRecentCount+1));
	res.send(postDatas);
};

/*
 * 文章分类
 */
exports.postcategory = function(req, res) {
	// 获取文章数据
	const postDatas = copyArr(require('../data/post.json'));
	var arr = [];
	postDatas.forEach(function(postData, index) {
		arr = arr.concat(postData.postCategories);
	});
  const map = arr.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map());
  // 去重数组
  const newArr = Array.from(map.keys());
  const result = [];
  newArr.forEach(function(elem, index) {
    const data = {};
    data.postCategoryName = elem;
    data.postCategoryCount = map.get(elem);
    result.push(data);
  });
	res.send(result);
};

/*
 * 文章标签
 */
exports.posttag = function(req, res) {
	// 获取文章数据
	const postDatas = copyArr(require('../data/post.json'));
	var arr = [];
	postDatas.forEach(function(postData, index) {
		arr = arr.concat(postData.postTags);
	});
  const map = arr.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map());
  // 去重数组
  const newArr = Array.from(map.keys());
  const result = [];
  newArr.forEach(function(elem, index) {
    const data = {};
    data.postTagName = elem;
    data.postCategoryCount = map.get(elem);
    result.push(data);
  });
	res.send(result);
};