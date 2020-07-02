const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const cors=require("cors")
const app=express();



app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.use(express.static("public"));


app.use(cors());
app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
  })



app.listen(200);

mongoose.connect("mongodb://localhost:27017/behaviouralDB",{ useUnifiedTopology: true, useNewUrlParser: true });

const userSchema={
    Username: {
        type: String,
        required: true,
        unique: true
    },
    Name: {
        type: String,
        required: true,
    },
    Age: {
        type: Number,
        required: true,
    },
    ColorGameScore: Number,
    MemoryMatrixScroe: Number,
    SimonGameScore: Number,
    CardAndSeekScore: Number
};

const user = mongoose.model("Users",userSchema);
var uname=null;

app.get("/",(req,res) => {
    res.sendFile('/login.html', { root: __dirname});
});

app.post("/index",function(req,res){
    uname = req.body.Uname;
    const name = req.body.Name;
    const age = req.body.Age;
    if(isNaN(age)){
        res.redirect("/");
    }
    console.log("called");
    user.find({Username: uname},function(err,founditem){
        console.log(founditem,err);
        if(founditem.length>0){
            res.redirect("/");   
        }
        else{
            const newuser = new user({
                Username: uname,
                Name: name,
                Age: age
            });
            newuser.save();
            res.sendFile('/index.html', { root: __dirname});
        }
    })
});

app.post("/generate",function(req,res){
    const received = req.body;
    user.findOneAndUpdate({Username: uname},{ColorGameScore: parseInt(received.score1), MemoryMatrixScroe: parseInt(received.score2), SimonGameScore: parseInt(received.score3), CardAndSeekScore: parseInt(received.score3)}, function(err){
        console.log(err);
    });

});

app.post("/report",function(req,res){
       res.sendFile("/report.html", { root: __dirname});
})

app.post("/:selectedGame",function(req,res){
    const Selected = req.params.selectedGame;
    console.log(Selected);
    res.sendFile(__dirname+'/'+Selected+'.html');
});

app.use((req,res) => {
    res.status(404).sendFile('/404.html', { root: __dirname})
});


