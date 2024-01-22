const express = require('express')
const morgan = require('morgan'); // thirdpart middleware instead of app.use()
const mongoose = require('mongoose'); // third part library for object document mapping (ODM)
const bodyParser = require('body-parser');
const User = require('./models/user');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');

// mongo db connect url
const dbURL = "mongodb+srv://htetwaiyan7191:719171@node-express-tuto.2vir9km.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => app.listen(3000))
.catch((err) => console.log(err)); // connect database 

//express app 
const app = express();

// middleware to parse json data in request body when testing with postman 
app.use(express.json());

// middleware using morgan library ! 
app.use(morgan('dev'));

// mongoose and mongo sandbox routes 


// use blogs routes 
app.use('/blogs', blogRoutes);

//list users 
app.use('/users', userRoutes);

//create user 
// app.post('/users', (req,res) => {
//     const user = new User({
//         username: req.body.username,
//         email: req.body.email,
//         password: req.body.password,
//         phone: req.body.phone,
//     });

//     user.save().then((result) => {
//         res.send({
//             status: 200,
//             data: result
//         });
//     })
//     .catch((err) => {
//         console.log(err)
//     })
// })

// // user show api/ detail
// app.get('/users/:id', (req, res) => {
//     const id = req.params.id;
//     User.findById(id).then((result) => {
//         return res.send(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     })
// })
// // user delete api/ 
// app.delete('/users/:id', (req, res) => {
//     const id = req.params.id;
//     User.findByIdAndDelete(id).then((result) => {
//         return res.send({
//             status: 200,
//             data: result,
//             message: "Delete user successful"
//         })
//     })
//     .catch((err) => {
//         console.log(err);
//     })
// })

// //user update api / patch method update partially ! 
// // update name api...
// app.patch('/users/:id', async (req,res) => {
//     const id = req.params.id;
//     const updateData = req.body;
//     const updatedUser = await User.findByIdAndUpdate(id, updateData, {new: true});
    
//     if(!updatedUser) {
//         return res.status(404).json({error: "User not found..."});
//     }

//     res.json({
//         message: 'User updated successfully',
//         status: 201,
//         data: updatedUser
//     })

// })



// middle ware using express static for static files 
app.use(express.static('public'));

// make post request available
// app.use(express.urlencoded({extended: true}));

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