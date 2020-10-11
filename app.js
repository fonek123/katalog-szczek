//dependencies
const express = require('express'),
    app = express(),
    serveStatic = require('serve-static'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override');

//dependencies setup 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use('/blogs', express.static('public'));
app.use('/blogs/edit', express.static('public'));
mongoose.connect("mongodb://localhost/restful_blog_app");
mongoose.set('useFindAndModify', false);
//SCHEMA SETUP
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
const Blog = mongoose.model("Blog", blogSchema);
//CREATE
Blog.create({
    title: "IT 4449",
    image: "https://i.ibb.co/12PCWYk/IT4449.jpg",
    body: "Szczęki Ø83"
});

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
        }   else {
            let dd = foundBlogs[0].created.getDate();
            let mm = foundBlogs[0].created.getMonth()+1; 
            const yyyy = foundBlogs[0].created.getFullYear();
            if(dd<10) {
                dd='0'+dd;
            } 

            if(mm<10) {
                mm='0'+mm;
            } 
            const today = dd+'-'+mm+'-'+yyyy;
            res.render("index", {foundBlogs: foundBlogs, today: today});
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
        const id = blog._id;
        res.render("post", {title: title, image: image, body: body, id: id}); 
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
app.listen(3000, function () {
    console.log("Server started");
});
