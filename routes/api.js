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
	// 文件夹路径
	var fileDirectory = "markdown/";
	// 获取文章数据
	var postDatas = copyArr(require('../data/post.json'));
	// 获取文章总数
    var totalPost = postDatas.length;
	// 每页显示文章数
	var perPageCount = 5;
	// 取得当前页数
	var page = req.query.page;
	// 求出总页数
    var totalPage;
    if (totalPost % perPageCount === 0) {
      totalPage = totalPost / perPageCount;
    } else {
      totalPage = (totalPost - totalPost % perPageCount) / perPageCount + 1;
    }
    // 如果页数不是当前范围直接返回404
	if (page < 1 || page > totalPage) {
		res.status(404).send('Sorry cant find that!');
	} else {
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
							var result = {};
							result.count = totalPost;
							result.data = postDatas;
							res.send(result);
						}
					});
				});
			});
		} else { console.log(fileDirectory + "  Not Found!"); }
	}
};

/*
 * 某个标签下的文章列表数据
 */
exports.taglist = function(req, res) {
	// 文件夹路径
	var fileDirectory = "markdown/";
	// 获取文章数据
	var postDatas = copyArr(require('../data/post.json'));
	// 取得当前标签
	var tag = req.query.tag;
	// 每页显示文章数
	var perPageCount = 5;
	// 取得当前页数
	var page = req.query.page;
	if (page === '') {
		page = 1;
	}
	var result = [];
	// 将文章数据倒序
	postDatas.reverse();
	// 判断文件夹路径是否存在
	if (fs.existsSync(fileDirectory)) {
		fs.readdir(fileDirectory, function(err, files) {
			if (err) { console.log(err); return; }
			files.reverse();
			// files = copyArr(files.slice(postPos, postPos + perPageCount));
			files.forEach(function(filename, index) {
				fs.readFile(fileDirectory + filename, function(err, data) {
					if (err) throw err;
					var splitData = data.toString().split('<!--more-->')[0];
					postDatas[index].postContent = marked(splitData);
					// if (index === files.length - 1) {
					// 	res.send(postDatas);
					// }
				});
			});
			// 判断当前标签是否存在
			var isTagExist = false;
			postDatas.forEach(function(postData, index) {
				for (var i = 0; i < postData.postTags.length; i++) {
					if (postData.postTags[i].text === tag) {
						isTagExist = true;
						result.push(postData);
						break;
					}
				}
			});
			// 如果标签不存在 返回404
			if (!isTagExist) {
				res.status(404).send('Sorry cant find that!');
			} else {
				// 获取文章总数
			    var totalPost = result.length;
				// 求出总页数
			    var totalPage;
			    if (totalPost % perPageCount === 0) {
			      totalPage = totalPost / perPageCount;
			    } else {
			      totalPage = (totalPost - totalPost % perPageCount) / perPageCount + 1;
			    }
				// 如果页数不是当前范围直接返回404
				if (page < 1 || page > totalPage) {
					res.status(404).send('Sorry cant find that!');
				} else {
					// 求出当前页的起始文章位置
					var postPos = (page - 1) * perPageCount;
					var data = {};
					data.count = totalPost;
					data.data = result.slice(postPos, postPos + perPageCount);
					// 截取要显示的文章数据并返回
					res.send(data);
				}
			}
		});
	} else { console.log(fileDirectory + "  Not Found!"); }
};

/*
 * 某个分类下的文章列表数据
 */
exports.categorylist = function(req, res) {
	// 文件夹路径
	var fileDirectory = "markdown/";
	// 获取文章数据
	var postDatas = copyArr(require('../data/post.json'));
	// 取得当前分类
	var category = req.query.category;
	// 每页显示文章数
	var perPageCount = 5;
	// 取得当前页数
	var page = req.query.page;
	if (page === '') {
		page = 1;
	}
	var result = [];
	// 将文章数据倒序
	postDatas.reverse();
	// 判断文件夹路径是否存在
	if (fs.existsSync(fileDirectory)) {
		fs.readdir(fileDirectory, function(err, files) {
			if (err) { console.log(err); return; }
			files.reverse();
			// files = copyArr(files.slice(postPos, postPos + perPageCount));
			files.forEach(function(filename, index) {
				fs.readFile(fileDirectory + filename, function(err, data) {
					if (err) throw err;
					var splitData = data.toString().split('<!--more-->')[0];
					postDatas[index].postContent = marked(splitData);
					// if (index === files.length - 1) {
					// 	res.send(postDatas);
					// }
				});
			});
			// 判断当前分类是否存在
			var isCategoryExist = false;
			postDatas.forEach(function(postData, index) {
				for (var i = 0; i < postData.postCategories.length; i++) {
					if (postData.postCategories[i] === category) {
						isCategoryExist = true;
						result.push(postData);
						break;
					}
				}
			});
			// 如果分类不存在 返回404
			if (!isCategoryExist) {
				res.status(404).send('Sorry cant find that!');
			} else {
				// 获取文章总数
			    var totalPost = result.length;
				// 求出总页数
			    var totalPage;
			    if (totalPost % perPageCount === 0) {
			      totalPage = totalPost / perPageCount;
			    } else {
			      totalPage = (totalPost - totalPost % perPageCount) / perPageCount + 1;
			    }
				// 如果页数不是当前范围直接返回404
				if (page < 1 || page > totalPage) {
					res.status(404).send('Sorry cant find that!');
				} else {
					// 求出当前页的起始文章位置
					var postPos = (page - 1) * perPageCount;
					var data = {};
					data.count = totalPost;
					data.data = result.slice(postPos, postPos + perPageCount);
					// 截取要显示的文章数据并返回
					res.send(data);
				}
			}
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
	// 文件夹路径
	var fileDirectory = "markdown/";
	var id = req.query.postId;
	var postDatas = require('../data/post.json');
	var isPostExist = false;
	// 判断文件夹路径是否存在
	if (fs.existsSync(fileDirectory)) {
		fs.readdir(fileDirectory, function(err, files) {
			if (err) { console.log(err); return; }
			files.forEach(function(filename, index) {
				if (filename === id+'.md') {
					isPostExist = true;
					fs.readFile(fileDirectory+id+'.md', function(err, data) {
				    	if (err) throw err;
						marked(data.toString(), function(err, content) {
							if (err) throw err;
							postDatas[id-1].postContent = content;
							res.send(postDatas[id-1]);
						});
					});
				}
			});
			if (!isPostExist) {
				res.status(404).send('Sorry cant find that!');
			}
		});
	} else { console.log(fileDirectory + "  Not Found!"); }
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
		var postTagText = [];
		postData.postTags.forEach(function(postTag, index) {
			postTagText.push(postTag.text);
		});
		arr = arr.concat(postTagText);
	});
	const map = arr.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map());
	// 去重数组
	const newArr = Array.from(map.keys());
	const result = [];
	newArr.forEach(function(elem, index) {
		const data = {};
		data.text = elem;
		data.link = 'https://rekodsc.com/tag/'+elem+'/';
		// data.link = '#!/tag/'+elem+'/';
		data.count = map.get(elem);
		data.weight = Math.floor(Math.random() * 9 + 16);
		result.push(data);
	});
	res.send(result);
};