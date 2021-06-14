const express = require('express')
const app = express()
var exphbs = require('express-handlebars');
const port = 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('home', { msg: 'Handlebars are Cool!' });
})

app.listen(3000, () => {
  console.log(`App listening on port ${3000}!`)
})