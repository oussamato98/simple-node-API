const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = new mongoose.Schema({

    title: String,
    content: String

});

const Article = mongoose.model("Article", articleSchema);


app.route("/articles")

        .get(function (req, res) {

            Article.find({})
                .then((rs) =>
                    res.send(rs)
                )
                .catch((err) =>
                    res.send(err));

        })

        .post(function (req, res) {

            const reqtitle = req.body.title;
            const reqcontent = req.body.content;
            console.log(reqtitle);
            console.log(reqcontent);

            const art = new Article({ title: reqtitle, content: reqcontent });
            Article.insertMany(art)
                .then((rs) => res.send(rs))
                .catch((err) => res.send(err));
        })

        .delete(function (req, res) {

            Article.deleteMany({})
                .then((rs) => {
                    res.send("All documents deleted successfully");
                })
                .catch((error) => {
                    res.send("Error deleting documents:", error);
                });
        });




app.route("/articles/:title")


        .get(function(req,res){

            Article.find({ title: req.params.title})
                .then((rs)=> res.send(rs))
                .catch((err)=>res.send(err))
        })

        .put(function(req,res){
            Article.replaceOne(
                    {title:req.params.title},
                    {title:req.body.title,  content:req.body.content})
                .then((rs)=> res.send("Successfully updated "))
                .catch((err) => res.send(err));


        })

        .patch(function(req,res){
            Article.updateOne(
                {title:req.params.title},
                {$set : req.body})
            .then((rs)=> res.send("Successfully updated "))
            .catch((err) => res.send(err));          
        })

        .delete(function(req,res){
            Article.deleteOne({title:req.params.title})
            .then((rs)=> res.send("successfully deleted"))
            .catch((err)=> res.send(err))

        })

















let port = process.env.PORT;

if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function () {
    console.log("Server is running");
});
