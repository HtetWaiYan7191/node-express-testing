const express = require('express')
const morgan = require('morgan');

//express app 
const app = express();

//listen for request 
app.listen(3000);

// middleware using morgan library ! 
app.use(morgan('tiny'));

// middle ware using express static for static files 
app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log('server is running')
    // res.send('<p>Home page</p>');
    res.sendFile('./views/index.html', {root: __dirname});
})

app.get('/about', (req, res) => {
    res.sendFile('./views/about.html', {root: __dirname})
})

app.get('/contact', (req, res) => {
    res.sendFile('./views/contact.html', {root: __dirname})
})

app.get('/htet', (req, res ) => {
    res.sendFile('./views/htet.html', {root: __dirname} )
})

//redirect 
app.get('/about-us', (req, res) => {
    res.redirect('/about');
})

app.get('/htet-wai', (req, res) => {
    res.redirect('/htet')
})

//404 page
app.use((req, res) => {
    res.sendFile('./views/404.html', {root: __dirname})
})