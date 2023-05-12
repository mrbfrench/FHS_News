const http = require('http')
const fs = require('fs')
const path = require('path')

const hostname = 'localhost'
const port = 48531

const server = http.createServer((req, res) => {
	let filePath = ""
	if (req.url === "/") {
		filePath = path.resolve('../index.html')
	} else {
		filePath = path.resolve('../'+req.url)
	}
	if (fs.existsSync(filePath)) {
		res.statusCode = 200
		fs.createReadStream(filePath).pipe(res)
	} else {
		res.statusCode = 404
		fs.createReadStream(path.resolve('../404.html')).pipe(res)
	}
})

server.listen(port, hostname, () => {
	console.log('Started at http://'+hostname+':'+port+'/')
})
