//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const app = express();
dotEnv.config();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect(process.env.DATABASE)
  .then(console.log(`Connected Successfully to the database`))
  .catch((err) => console.log(err));

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: [4, "Title must at least be 4 charachters"],
  },
  content: {
    type: String,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

async function getData() {
  const findBlog = await Blog.find({});

  if (!findBlog.length) {
    Blog.insertMany([
      {
        title: "Home",
        content:
          "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.",
      },
      {
        title: "About",
        content:
          "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.",
      },
      {
        title: "Contact",
        content:
          "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.",
      },
    ]);
  }
}

getData();

const Post = mongoose.model("Post", blogSchema);

app.get("/", async function (req, res) {
  const home = await Blog.find({ title: "Home" });

  const posts = await Post.find({});
  res.render("home", {
    startingContent: home[0].content,
    posts: posts,
  });
});

app.get("/about", async function (req, res) {
  const about = await Blog.find({ title: "About" });
  res.render("about", { aboutContent: about[0].content });
});

app.get("/contact", async function (req, res) {
  const contact = await Blog.find({ title: "Contact" });
  res.render("contact", { contactContent: contact[0].content });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody,
  };

  Post.insertOne(post)
    .then(console.log(`Post Inserted Successfully`))
    .catch((err) => console.log(err));

  res.redirect("/");
});

app.get("/posts/:postName", async function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);
  const posts = await Post.find({});
  posts.forEach(function (post) {
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
