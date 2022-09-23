const fs = require('fs');
const randomWords = require('random-words');

const stripeApp = JSON.parse(fs.readFileSync('stripe-app.json'));
const package = JSON.parse(fs.readFileSync('package.json'));

package.name = stripeApp.id = `com.example.${randomWords(3).join('-')}`;

fs.writeFileSync('stripe-app.json', JSON.stringify(stripeApp, null, 2), 'utf8');
fs.writeFileSync('package.json', JSON.stringify(package, null, 2), 'utf8');

console.log(`New app ID: ${package.name}`);