const franc = require('franc');
const colors = require('colors');
const langs = require('langs');
const cowsay = require('cowsay');

const language = langs.where('3', franc(process.argv[2]))
try {
    console.log(cowsay.say({text: language.name}))

} catch (err) {
    console.log('Could not match the language. Please try again with larger sample'.brightRed)
}
