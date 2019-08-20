const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/resful_blog_app", {
  useNewUrlParser: true
});

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  create: { type: Date, default: Date.now }
});

const Blog = new mongoose.model("Blog", blogSchema);

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    err ? console.log(err) : res.render("index", { blogs: blogs });
  });
});

app.get("/blogs/new", (req, res) => {
  res.render("new");
});

app.post("/blogs", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    err ? res.render("new") : res.redirect("/blogs");
  });
});

app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    err ? res.redirect("/blogs") : res.render("show", { blog: foundBlog });
  });
});

app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    err ? res.redirect("/blogs") : res.render("edit", { blog: foundBlog });
  });
});

app.put("/blogs/:id", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    err ? res.redirect("/blogs") : res.redirect("/blogs/" + req.params.id);
  });
});

app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err, updatedBlog) => {
    err ? res.redirect("/blogs") : res.redirect("/blogs");
  });
});

app.listen(3000, () => console.log("Books Review App running in port 3000"));
