var express = require('express');
var server = express();

server.use(express.static('src'));
server.use('/node_modules', express.static('node_modules'));
server.listen(3000, () => {
	console.log('Listen on port 3000')
});