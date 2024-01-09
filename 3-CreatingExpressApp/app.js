const express = require('express')
const morgan = require('morgan'); // thirdpart middleware instead of app.use()
const mongoose = require('mongoose'); // third part library for object document mapping (ODM)
const Blog = require('./models/blog');

// mongo db connect url
const dbURL = "mongodb+srv://htetwaiyan7191:719171@node-express-tuto.2vir9km.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => app.listen(3000))
.catch((err) => console.log(err)); // connect database 

//express app 
const app = express();

// middleware using morgan library ! 
app.use(morgan('tiny'));

// mongoose and mongo sandbox routes 

app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'Blog 3',
        snippet: 'Hello',
        body: 'I am learning nodejs these days '
    });
    blog.save()
    .then((result) => {
        res.send(result)
    })
    .catch((err) => {
        console.log(err)
    })
})

// list all blogs 
app.get('/all-blogs', (req, res) => {
    Blog.find().then((result) => {
        res.send(result);
    })
    .catch((err) => {
        console.log(err);
    })
})

// find single blog 
app.get('/single-blog', (req, res) => {
    Blog.findById('659cc736588db5b6456936a0')
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        console.log(err);
    })
})

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