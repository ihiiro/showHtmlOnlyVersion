const fs = require('fs');
const path = require('path');

const file = (filepath) => {
  return fs.readFileSync(path.resolve(__dirname, './static', filepath), 'utf8');
};

module.exports = file;
