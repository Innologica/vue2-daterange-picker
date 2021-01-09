const vuedoc = require('@vuedoc/parser');
const config = require('./config.json');
const fs = require('fs');
const path = require('path');

const jobs = Object.keys(config.components).map((name) => {
  const component = config.components[name];
  const componentPath = component.path ? path.resolve(__dirname, '../src/', component.path) :  '../../src/elements';

  return vuedoc.parse({ filename: path.resolve(__dirname, `${componentPath}/${name}.vue`) });
});
// Target json file
const filePath = path.resolve(__dirname, '../docs.json');

if (!fs.existsSync(filePath)) {
  fs.closeSync(fs.openSync(filePath, 'w', '0666'));
}

Promise.all(jobs).then((docs) => {
  const buffer = Buffer.from(JSON.stringify(docs));

  fs.writeFileSync(filePath, buffer);

  console.log("Component documentation has been parsed");

  process.exit(0);
}).catch(err => {
  console.error(err);

  process.exit(1);
});