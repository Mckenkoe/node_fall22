const { response } = require('express');
var express = require('express');
var mongoose = require('mongoose');
var app = express();

const mongoDB = 'mongodb+srv://mckenko:mrk8019122@cluster0.av1xhkk.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console,"MongoDB connection error"));

app.use('/static',express.static("public"));
app.use(express.urlencoded({ extended: true}))
app.set("view engine", "ejs");

app.get('/', function(req,res){
    res.render('todo.ejs');
})

app.post('/',(req, res) =>{
    console.log(req.body.content)
})

app.listen(3000, function(){
    console.log('App listening on port 3000');
})