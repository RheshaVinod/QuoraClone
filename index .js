var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var fs = require("fs");

var user_data; //array of particular user's info
var ques_data;
mongoose.connect('mongodb://localhost:27017/data',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))
const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

app.post("/sign_up",(req,res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var phno = req.body.phno;
    var sem = req.body.sem;
    var branch = req.body.branch;
    var password = req.body.password;

    var data = {
        "name": name,
        "email" : email,
        "phno": phno,
        "sem": sem,
        "branch": branch,
        "password" : password
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('loginPage.html')

})

app.post("/login",(req,res)=>{
    var name = req.body.name;
    var password = req.body.password;

    var data = {
        "name": name,
        "password" : password
    }

    db.collection('users').findOne(data, function (err, docs) {
        if (err){
            throw err;
        }
        else if (docs)
        {
            user_data= docs; 
            return res.redirect('main.html')
        }
        else
        {
            //res.send(500,'showAlert')
            return res.redirect('loginPage.html')
        }
    });
})
app.post("/question",(req,res)=>{
    
    var ques = req.body.question;

    var data = {
        "question": ques,
    }
    
    if(data)
    {
        console.log(data);
        
        var file='C:/Users/Enoch/Documents/WT Project/Test/public/question.json'
        fs.writeFile(file, JSON.stringify(data), err => {
            if (err) throw err; 
            console.log("Done writing");
        })
    }    

    db.collection('questions').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted succesfully");
    
    })

    return res.redirect('main.html')
})
app.get("/account",(req,res)=>{
    if(user_data)
    {
        console.log(user_data);
        
        var file='C:/Users/Enoch/Documents/WT Project/Test/public/users.json'
        fs.writeFile(file, JSON.stringify(user_data), err => {
            if (err) throw err; 
            console.log("Done writing");
        });

        return res.redirect('account.html')
    }
})
app.get("/main",(req,res)=>{
    if(ques_data)
    {
        console.log(ques_data);
        var file='C:/Users/Enoch/Documents/WT Project/Test/public/questions.json'
        fs.writeFile(file, JSON.stringify(ques_data), err => {
            if (err) throw err; 
            console.log("Done writing");
        });
    }
})
 





app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('loginPage.html');
}).listen(3000);






console.log("Listening on PORT 3000");