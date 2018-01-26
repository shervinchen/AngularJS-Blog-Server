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

function copyArr(arr) {
    var res = []
    for (var i = 0; i < arr.length; i++) {
     res.push(arr[i]);
    }
    return res
}

/*
 * 文章列表数据
 */
exports.postlist = function (req, res) {
	// 每页显示文章数
	var pagePostCount = 5;
	// 取得当前页数
	var page = req.query.page;
  // 文件夹路径
  var fileDirectory = "markdown/";
  // 获取文章数据
	var postDatas = copyArr(require('../data/post.json'));
  // 求出当前页的起始文章位置
  var postPos = (page - 1) * pagePostCount;
  // 截取要显示的文章数据
  postDatas = postDatas.reverse().slice(postPos, postPos + pagePostCount);
  // 判断文件夹路径是否存在
  if (fs.existsSync(fileDirectory)) {
    console.log(postDatas);
    fs.readdir(fileDirectory, function(err, files) {
      if (err) {
        console.log(err);
        return;
      }
      files = files.reverse().slice(postPos, postPos + pagePostCount);
  		files.forEach(function(filename, index) {
  			fs.readFile(fileDirectory + filename, function(err, data) {
          if (err) throw err;
  				postDatas[index].postContent = marked(data.toString().split('<!--more-->')[0]);
          if (index === files.length - 1) {
            res.send(postDatas);
          }
  			});
  		});
  	});
  } else {
    console.log(fileDirectory + "  Not Found!");
  }
};

/*
 * 文章数据
 */
exports.post = function (req, res) {
	var id = req.query.postId;
	var postDatas = require('../data/post.json');

  var data = '';
  // 创建可读流
  var readerStream = fs.createReadStream('markdown/'+id+'.md');
  // 设置编码为 utf8。
  readerStream.setEncoding('UTF8');
  // 处理流事件 --> data, end, and error
  readerStream.on('data', function(chunk) {
    data += chunk;
  });
  readerStream.on('end',function(){
    // postDatas[id-1].postContent = marked(data);
    // res.json(postDatas[id-1]);

    marked(data, function (err, content) {
      if (err) throw err;
      postDatas[id-1].postContent = content;
      res.json(postDatas[id-1]);
    });
  });
  readerStream.on('error', function(err){
    console.log(err.stack);
  });

	// fs.readFile('markdown/'+id+'.md', function(err, data) {
  //   if (err) throw err;
	// 	postDatas[id-1].postContent = marked(data.toString());
	// 	res.json(postDatas[id-1]);
	// });
};
