const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const path =require('path');

app.use(bodyParser.json());

const db = require("./db");
const collection = "todo";

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/getTodos',(req,res)=>{
    db.getDB().collection(collection).find({}).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else
            console.log(documents);
            res.json(documents);
    });
});

app.put('/:id',(req,res)=>{
    const todoID = req.params.id;
    const userInput = req.body;
    db.getDB().collection(collection).findOneAndUpdate({_id : todoID},{$set : {todo : userInput.todo}},{returnOriginal : false},(err, result)=>{
        if(err)
            console.log(err);
        else
            res.json(result);
    });

});

app.post('/',(req,res)=>{
     const userInput = req.body;
     db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
        if(err)
            console.log(err);
        else
            res.json({result : result,document : result.ops[0]});
     });

});


db.connect((err)=>{
    // If err unable to connect to database
    // End application
    if(err){
        console.log('unable to connect to database');
        process.exit(1);
    }
    
    else{
        app.listen(8000,()=>{
            console.log('connected to database, app listening on port 8000');
        });
    }
});