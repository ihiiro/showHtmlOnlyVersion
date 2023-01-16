const http = require('http');
const url = require('url');
const {exec} = require('child_process');
const cheerio = require('cheerio');
const file = require('./file');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(file('index.html'));
  }
  else if (req.url.startsWith('/raw-html')) {
    const query = url.parse(req.url, true).query;

    exec(`curl ${query.url} -L`, (err, stdout, stderr) => {
      if (err) {
        res.writeHead(404, {'content-type': 'text/plain'});
        res.end(`Error fetching ${query.url}`);
      } else {
        const $ = cheerio.load(stdout);
        $('link[href^="http"]').remove();
        $('script[src^="http"]').remove();
        $('style').remove();
        $('script').remove();
        $('*').removeAttr('style');

        res.writeHead(200, {'content-type': 'text/html'});
        res.end($.html());
      }
    });
  }
  else if (req.url === '/styles.css') {
    res.writeHead(200, {'content-type': 'text/css'});
    res.end(file('styles.css'));
  } else {
    res.writeHead(404);
    res.end(`Cannot ${req.method} ${req.url}`);
  }
});

server.listen(8080, () => {
  console.log('server listening on port 8080...');
});
