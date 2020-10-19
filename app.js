//dependencies
const express = require('express'),
    app = express(),
    serveStatic = require('serve-static'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override');

//MongoDB connect
const dbRoute = 'mongodb+srv://Szymon:jakieshaslo@katalogszczek.rigkl.gcp.mongodb.net/blogs?retryWrites=true';
const dbRouteLocal = 'mongodb://localhost/katalog-szczek';

mongoose.connect(dbRoute, { useNewUrlParser: true }, { useUnifiedTopology: true },).then(() => {
    console.log('Connected to mongoDB')
}).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});
// mongoose.set('useFindAndModify', false);

//dependencies setup 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use('/blogs', express.static('public'));
app.use('/blogs/edit', express.static('public'));
// var dev_db_url = 'mongodb+srv://Szymon:jakieshaslo@katalogszczek.rigkl.gcp.mongodb.net/blogs?retryWrites=true';
// mongoose.connect(process.env.MONGODB_URI || dev_db_url);
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-    With,content-type,Accept,content-type,application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS,     PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


//SCHEMA SETUP
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    diameter: String,
    
});
const Blog = mongoose.model("Blog", blogSchema);
//CREATE
// https://ibb.co/5cg1y7C
// https://ibb.co/WGLk9Cr
// https://ibb.co/fvwksDZ
// https://ibb.co/swqrrJG
// Blog.create({
//     title: "IT 4449",
//     image: "https://i.ibb.co/12PCWYk/IT4449.jpg",
//     diameter: "Ø83",
//     body: "Szczęki Ø83"
// });

//ROUTES

//INDEX REDIRECT
app.get("/", function (req, res) {
    res.redirect("/blogs");
});
//EDIT
app.get("/blogs/edit/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        
        res.render("edit", {blog: blog});
    })
    
});



//INDEX
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, foundBlogs) {
        if (err) {
            console.log("ERROR");
            console.log(err);
        } 
        else 
        {   
                res.render("index", {foundBlogs: foundBlogs});
        }
    })
});

//NEW POST
app.get("/blogs/new", function (req, res) {
    res.render("new");
});
//POST
app.post("/blogs", function (req, res) {
    Blog.create(req.body, function (err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs")
        }
    })
});

//SHOW EACH POST

app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        const title = blog.title;
        const image = blog.image;
        const body = blog.body;
        const diameter = blog.diameter;
        const id = blog._id;
        res.render("post", {title: title, image: image, body: body, id: id, diameter: diameter}); 
    });
    
});

//EDIT POST


app.put("/blogs/edit/:id", function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body, function (err, blog) {
        res.redirect("/blogs/"+ blog._id); 
        
    });
});

app.delete("/blogs/edit/:id", function (req, res) {
    Blog.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            console.log("ERROR");
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});



app.get("/blogs/*", function (req, res) {
    res.redirect("/blogs");
});
app.listen(process.env.PORT || 3000, function () {
    console.log("Server started");
    
});