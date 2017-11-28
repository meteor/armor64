const path = require('path');
const fs = require('fs');

const mdpath = path.resolve(__dirname, 'src/content.md');
const outpath = path.resolve(__dirname, 'src/templates/content.html');
const md = fs.readFileSync(mdpath).toString();

const Markdown = require('markdown-it');
const convert = new Markdown();
const html = convert.render(md);

fs.writeFileSync(outpath, html);
console.log('built content.html');