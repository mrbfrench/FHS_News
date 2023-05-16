const http = require('http')
const fs = require('fs')
const path = require('path')

const hostname = 'localhost'
const port = 48531

const projectRoot = path.resolve('./')

const server = http.createServer((req, res) => {
	req.url = req.url.split("?")[0]
	console.log(projectRoot+req.url)
	let filePath = ""
	if (req.url == "/") {
		filePath = path.resolve(projectRoot+'/index.html')
	} else {
		filePath = path.resolve(projectRoot+req.url)
	}
	if (fs.existsSync(filePath)) {
		res.statusCode = 200
		fs.createReadStream(filePath).pipe(res)
	} else {
		res.statusCode = 404
		fs.createReadStream(path.resolve('./404.html')).pipe(res)
	}
})

server.listen(port, hostname, () => {
	console.log('Started at http://'+hostname+':'+port+'/')
	console.log("The development viewer is now running. You should be able to preview the website as you work now.")
	console.log("You do not need to re-run it each time you make changes, your changes should automatically appear in the web browser each time you refresh the page.")
	import('open').then(module => {module.default('http://'+hostname+':'+port+'/')})
})
