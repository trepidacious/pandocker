const puppeteer = require('puppeteer')
const { execSync } = require('child_process');

async function printPDF() {

  const html = execSync("pandoc --standalone --mathjax --lua-filter /filters/graphviz.lua --lua-filter /filters/rfc8174.lua -H /styles/default-styles-header.html /data/example.md -o /data/out/example.html");
  console.log(html.toString());

  const docx = execSync("pandoc --standalone --mathjax --lua-filter /filters/graphviz.lua --lua-filter /filters/rfc8174.lua -H /styles/default-styles-header.html /data/example.md -o /data/out/example.docx");
  console.log(docx.toString());

  // Note fix for restricted shm space by default in docker, see 
  // https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-dev-shm-usage']
    });

  // TODO use generated html file as input
  // TODO more formatting, e.g. margins?  
  // TODO use options from https://github.com/puppeteer/puppeteer/blob/v3.0.1/docs/api.md#pagepdfoptions
  // TODO get papersize from front matter
  const page = await browser.newPage();
  await page.goto('file:///data/out/example.html', {waitUntil: 'networkidle2'});
  await page.pdf({path: '/data/out/example.pdf', format: 'A4'});
  await browser.close();
}

printPDF();