const puppeteer = require('puppeteer');
const express = require('express');
const fileUpload = require('express-fileupload');
const port = 3000
const app = express();
const reader = require('./readandprocessfile')

// default options
app.use(fileUpload());

var getSearchResults = async (key) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--window-size=1920,1080'
    ]
  })
  console.log('looking for :'+key)
  const page = await browser.newPage();
  page.setViewport({height: 1080, width: 1920})
  await page.goto('https://www.google.com/search?q='+key);
  await page.waitFor(() => document.querySelectorAll('div').length)
  const list = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll("div.r > a")).map(ele => ele = ele.href)
  });
  console.log(await list.jsonValue());
  await page.screenshot({path: 'search.png'});
  await browser.close();
};



async function someFunction(keys) {
  for (let i = 0; i < keys.length; i++) {
      // wait for the promise to resolve before advancing the for loop
      await getSearchResults(keys[i]);
  }
}

app.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let sampleFile = req.files.sampleFile;
  sampleFile.mv('uploads/'+sampleFile.name, function(err) {
    if (err) {
        return res.status(500).send(err);
    }
    reader.readFile(sampleFile.name, someFunction)
    res.send('File uploaded!');
  });
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))