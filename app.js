const { response } = require('express');
var express = require('express');
var mongoose = require('mongoose');
var app = express();

const Todo = require('./models/todo.model');
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

//Creates item in DB
app.post('/',(req, res) =>{
    let newTodo = new Todo({
        todo: req.body.content,
        done: false
    })
    newTodo.save(function(err,todo){
        if(err){
            res.json({"Error: ":err})
        }else{
            res.json({"Status: ": "Successful", "ObjectID:": todo.id})
        }
    })
})

//Modifies item in DB
app.put('/', (req,res) => {
    let id = req.body.check;
    let error = {}
    if(typeof id === "string"){
        Todo.updateOne({_id: id},{done:true}, function(error){
            if(error){
                err = error;
            }
        })
    }else if(typeof id === "object"){
        id.foreach(ID => {
            Todo.updateOne({_id: id},{done:true}, function(error){
                if(error){
                    err = error;
                }
            })
        })
    }
    if(err){
        res.json({"Error: ":err})
    }else{
        res.json({"Status: ": "Successful"})
    }
})

app.delete('/', (req,res) => {
    let id = req.body.check;
    let error = {}
    if(typeof id === "string"){
        Todo.deleteOne({_id: id}, function(error){
            if(error){
                err = error;
            }
        })
    }else if(typeof id === "object"){
        id.foreach(ID => {
            Todo.deleteOne({_id: id},{done:true}, function(error){
                if(error){
                    err = error;
                }
            })
        })
    }
    if(err){
        res.json({"Error: ":err})
    }else{
        res.json({"Status: ": "Successful"})
    }
})

app.listen(3000, function(){
    console.log('App listening on port 3000');
})