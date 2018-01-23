var marked = require('marked');
var fs = require('fs');

/*
 * Serve JSON to our AngularJS client
 */
exports.name = function (req, res) {
	// res.json({
	// 	name: 'Bob'
	// });

	fs.readFile('markdown/README.md', function(err, data) {
		var html = marked(data.toString());
		// res.send(html);
		res.json({
			id: '1',
			postTitle: '适用移动端的样式重置',
			date: 'November 24, 2017',
			postContent: html
		});
	});
};