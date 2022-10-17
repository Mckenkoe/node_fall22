const { response } = require('express');
var express = require('express');
var mongoose = require('mongoose');
var axios = require('axios');
var app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const Todo = require('./models/todo.model');
const mongoDB = 'mongodb+srv://mckenko:mrk8019122@cluster0.av1xhkk.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console,"MongoDB connection error"));

app.use('/static',express.static("public"));
//app.use(express.urlencoded({ extended: true}))
app.set("view engine", "ejs");

app.get('/', function(req,res){
    let comicData = {}
    axios.get("https://xkcd.com/info.0.json").then(function(response){
        Todo.find(function(err,todo){
            console.log(todo);
            if(err){
                res.json({"Error: ":err})
            }else{
                res.render('todo.ejs',{todo:todo, comicData: response.data});
            }
        })
    }).catch(function(error){
        res.json({"Error: ":error})
    })
    
})

//Creates item in DB
app.post('/create',(req, res) =>{
    let newTodo = new Todo({
        todo: req.body.content,
        done: false
    })
    newTodo.save(function(err,todo){
        if(err){
            res.json({"Error: ":err})
        }else{
            res.redirect('/');
        }
    })
})

//Modifies item in DB
app.put('/done', (req,res) => {
    let id = req.body.id;
    let err = {}
    console.log(req.body)
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
        res.redirect('/');
    }
})

app.delete('/delete/:id', (req,res) => {
    let id = req.params.id
    let err;
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
        res.redirect('/');
    }
})

app.listen(3000, function(){
    console.log('App listening on port 3000');
})