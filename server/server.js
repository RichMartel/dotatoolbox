var express = require('express');
var path = require('path'); 
var server = express();
server.use(express.static(__dirname + '/../webroot'));
server.get('*', function(req, res) {
	res.sendFile(path.resolve(__dirname + '/../webroot/index.html'));
});
var port = 3000;
server.listen(port, function() {
	console.log('Server listening on port ' + port);
});
