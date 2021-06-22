var mongo=require('mongodb');
var assert=require('assert');
var url='mongodb+srv://Isha:isha@miniflix.bqr42.mongodb.net/miniflix?retryWrites=true&w=majority';
var http = require("http");
var express = require('express');
var app = express();
const fs = require("fs");
const mongoose=require('mongoose');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

var user;
var fav;
var b=[];
app.set("view engine", "ejs"); 


app.set("views", __dirname + "/views"); 


app.use(bodyParser.urlencoded({ extended: false })); 

app.post('/plan',function(req, res){

  res.sendFile(__dirname + '/plan.html');
}
);

app.post('/payment',function(req, res){
  p=req.body.Plan;

  if(p=="Mobile")
  a=199;
  else if(p=="Basic")
  a=499;
  else if(p=="Standard")
  a=649;
  else
  a=799;

mongo.MongoClient.connect(url, function (error, client) {
  if (error) {
    res.json(error);
    return;
  }
 const dbo = client.db('miniflix');
 dbo.collection("users").updateOne({'email':user.email},
   {$set:{'plan':p}}, (err, result) => {
  if (err) throw err;
  else{
    res.render("payment",{amount:a});
  }
});

});
 
});


app.get('/home',function(req, res){
  res.render("home");
}
);

app.get('/edit_profile',function(req, res){
  res.render("editprofile",{p:user.password});
});

app.get('/profile',function(req, res){
  mongo.MongoClient.connect(url, function (error, client) 
    {    
      if (error) {
        res.json(error);
        return;
      }

      const dbo = client.db('miniflix');
      var query = { email:user.email};
      dbo.collection("users").findOne(query,(err, result) => {
        if (err) throw err;
        console.log(result);
  res.render("profile",{name:result.name,email:user.email,country:result.country,plan:result.plan});
});

});

});


 app.post('/details_movie',urlencodedParser, function(req, res){
    n=req.body.name;
    console.log(n);
    mongo.MongoClient.connect(url, function (error, client) {
      if (error) {
        res.json(error);
        return;
      }
      const db = client.db('miniflix');
      db.collection('movies').findOne({name:n}, (err, result) => {
        if (err) throw err;
        else{
        console.log(result.name);
        res.render("details_movie", {poster:result.poster,director:result.director,rating:result.rating,actors:result.actors,name: n,desc: result.desc,imdb: result.imdb,genre: result.genre,language: result.language,duration: result.duration,year:result.year});
        }
        });
    
  });
  });

app.post('/profile',urlencodedParser, function(req, res){

 p=req.body.password2;
 plan=req.body.plan;
 c=req.body.country;
 mongo.MongoClient.connect(url, function (error, client) {
  if (error) {
    res.json(error);
    return;
  }
 const dbo = client.db('miniflix');
 dbo.collection("users").updateOne({'email':user.email},
   {$set:{'password':p,'plan':plan,'country':c}}, (err, result) => {
  if (err) throw err;
  else{
  res.render("profile",{name:user.name,email:user.email,country:c,plan:plan});
  }
});

});

});

app.get('/fav',urlencodedParser,function(req, res){
  f=user.fav;
  f=f.split(",");
  console.log(f);
  let a=[]
  flag=0;
  setTimeout(callBackk,5000);
  mongo.MongoClient.connect(url,function (error, client) {
    if (error) {
      res.json(error);
      return;
    }
  const db = client.db('miniflix');
  for(i=0;i<f.length;i++)
  {  
      console.log(f[i]);
      db.collection('movies').findOne({name:f[i]}, (err, result) => {
      if (err) throw err;
      else if(result!=null){
      console.log(result);
      a.push(result);
      flag=1;
      }
    });
      if(flag==0)
      {
          db.collection('series').findOne({name:f[i]}, (err, result2) => {
          console.log(result2);
          if (err) throw err;
          
          else if(result2!=null){
          console.log(result2);
          a.push(result2);
          }
      });

    }
  
}
});
function callBackk(){
console.log(a);
res.render("favorites",{fav:a});
}

});



app.get('/payment',function(req, res){
  res.sendFile(__dirname + '/payment.html');
});

app.post('/search_genre_m',urlencodedParser, function(req, res){

  g=req.body.genre;
  console.log(g);
  mongo.MongoClient.connect(url, function (error, client) {
    if (error) {
      res.json(error);
      return;
    }
    const dbo = client.db('miniflix');
    var query = { genre:g};
    dbo.collection("movies").find(query).toArray(function(err, result) {
      if (err) throw err;
      else if(result.length==0)
      { 
        res.send("No movie belonging to this genre.");
      }
    else{
      console.log(result);
      res.render("filter_movies", { result:result});
      }
      });
    });
  

});


app.post('/search_l_m',urlencodedParser, function(req, res){

  l=req.body.lang;
  console.log(l);
  mongo.MongoClient.connect(url, function (error, client) {
    if (error) {
      res.json(error);
      return;
    }
    const dbo = client.db('miniflix');
    var query = { language:l};
    dbo.collection("movies").find(query).toArray(function(err, result) {
      if (err) throw err;
      else if(result.length==0)
      { 
        res.send("No movie in this language.");
      }
    else{
      console.log(result);
      res.render("filter_movies", { result:result});
      }
      });
    });
  

});

app.post('/search_l_s',urlencodedParser, function(req, res){

  l=req.body.lang;
  console.log(l);
  mongo.MongoClient.connect(url, function (error, client) {
    if (error) {
      res.json(error);
      return;
    }
    const dbo = client.db('miniflix');
    var query = { language:l};
    dbo.collection("series").find(query).toArray(function(err, result) {
      if (err) throw err;
      else if(result.length==0)
      { 
        res.send("No series in this language.");
      }
    else{
      console.log(result);
      res.render("filter_series", { result:result});
      }
      });
    });
  

});

app.post('/search_genre_s',urlencodedParser, function(req, res){
  g=req.body.genre;
  console.log(g);

  mongo.MongoClient.connect(url, function (error, client) {
    if (error) {
      res.json(error);
      return;
    }
    const dbo = client.db('miniflix');
    var query = { genre:g};
    dbo.collection("series").find(query).toArray(function(err, result) {
      if (err) throw err;
      else if(result.length==0)
      { 
        res.send("No series belonging to this genre.");
      }
    else{
      console.log(result);
      res.render("filter_series", { result:result });
      }
      });
    });
});

app.post('/home',urlencodedParser, function(req, res){
  e=req.body.email;
  p=req.body.password;

  mongo.MongoClient.connect(url, function (error, client) {
    if (error) {
      res.json(error);
      return;
    }
    
    const dbo = client.db('miniflix');
    var query = { email:e,password:p};
    dbo.collection("users").find(query).toArray(function(err, result) {
      if (err) throw err;
      else if(result.length==0)
      { 
        res.render("index", { user: "Incorrect username/password.",plan:false });
      }
      else{
      user=result[0];
      console.log(user);
      if(user.plan=="")
      {
        res.sendFile(__dirname + '/plan.html');
      }
      else
      res.render("home");
      }
      });
    });

  });

  app.post('/home_add',urlencodedParser, function(req, res){
    n=req.body.fav;
    flag=0;
    console.log(n);
    f=user.fav;
    console.log(f);
    if(f.length==0){
    f+=n;
    
    console.log(f);
    }

    else{
    favor = f.split(",");
    for(i=0;i<favor.length;i++)
    {
      if(favor[i]==n)
      {
        favor.splice(i,1);
        console.log(favor);
        flag=1;
        break;
      }
    }

    
    if(flag==0)
    f=f+","+n;
    
    else
    f=favor.join();
    console.log(f);

    }
    user.fav=f;
    mongo.MongoClient.connect(url, function (error, client) {
      if (error) {
        res.json(error);
        return;
      }
      
      const dbo = client.db('miniflix');
      var query = { email:user.email};
      dbo.collection("users").updateOne({'email':user.email},
      {$set:{'fav':f}}, (err, result) => {
        if (err) throw err;
        else{
          res.render("home");
        }
        });
      });
    
    });

  app.post('/search_home',urlencodedParser, function(req, res){
    s=req.body.search;
    console.log(s);
    mongo.MongoClient.connect(url, function (error, client) {
      if (error) {
        res.json(error);
        return;
      }
      
      const dbo = client.db('miniflix');
      var query = { name:new RegExp(s,'i')};
      dbo.collection("movies").find(query).toArray(function(err, result_m) {
        if (err) throw err; 
        else{
          console.log(result_m.length);
          dbo.collection("series").find(query).toArray(function(err, result_s) {
            if (err) throw err;
            else if(result_m.length==0&&result_s.length==0)
            { 
              res.send("No such movie or series found.");
            }
            else{
            console.log(result_s.length);
            console.log(result_m.length);
            res.render("search", {result_m:result_m,result_s:result_s});
            }
          
        });
      }
    });

  });

});

      
  app.post('/details_movie',urlencodedParser, function(req, res){
    n=req.body.name;
    console.log(n);
    mongo.MongoClient.connect(url, function (error, client) {
      if (error) {
        res.json(error);
        return;
      }
      const db = client.db('miniflix');
      db.collection('movies').findOne({name:n}, (err, result) => {
        if (err) throw err;
        else{
        console.log(result.name);
        res.render("details_movie", {poster:result.poster, name: n,desc: result.desc,imdb: result.imdb,genre: result.genre,language: result.language,duration: result.duration,year:result.year});
        }
        });
    
  });
  });

  app.post('/details_series',urlencodedParser, function(req, res){
    n=req.body.name;
    mongo.MongoClient.connect(url, function (error, client) {
      if (error) {
        res.json(error);
        return;
      }
      const db = client.db('miniflix');
      db.collection('series').findOne({name:n}, (err, result) => {
        if (err) throw err;
        else{
        console.log(result);
        res.render("details_series", {director:result.director,rating:result.rating,actors:result.actors,poster:result.poster,name: n,desc: result.desc,imdb: result.imdb,genre: result.genre,language: result.language,seasons:result.seasons,year:result.year});
        }
        });
    
  });
  });

  app.get('/signup', function(req, res){
    res.sendFile(__dirname + '/signup.html');
  });

  app.get('/', function(req, res){
    res.render("index", { user:"",plan:false});
  });


  app.post('/login',urlencodedParser,function(req, res){
    name=req.body.name;
    email=req.body.email;
    password=req.body.password;
    country=req.body.country;
    plan="";
    fav="";
    user={name,email,password,country,plan,fav};
    console.log(user);
    mongo.MongoClient.connect(url, function (error, client) 
    {    
      if (error) {
        res.json(error);
        return;
      }
      // connect to the miniflix database
      const dbo = client.db('miniflix');
      var query = { email:email };
      dbo.collection("users").find(query).toArray(function(err, result) {
        if (err) throw err;
        else if(result.length==0)
        {assert.equal(null,err);
          dbo.collection('users').insertOne(user,function(err,result)
          {
              assert.equal(null,err);
              console.log("Item inserted");
              res.render("index", { user: "User registered successfully!!",plan:true});
        });
        
        }
        else{
          res.render("index", { user: "An account with this email already exists.",plan:false});
        }
      });
    });
  });
     
  app.get("/movies", function (req, res) {
    n="Raazi";
    console.log(n);
    mongo.MongoClient.connect(url, function (error, client) {
      if (error) {
        res.json(error);
        return;
      }
      const db = client.db('miniflix');
      db.collection('movies').findOne({name:n}, (err, result) => {
        if (err) throw err;
        else{
        console.log(result.name);
        res.render("movies", {poster:result.poster,director:result.director,rating:result.rating,actors:result.actors});
        }
        });
      
      });


  });
  

   app.get("/series", function (req, res) {
        mongo.MongoClient.connect(url, function (error, client) {
          if (error) {
            res.status(500).json(error);
            return;
          }
          else{
            res.sendFile(__dirname + '/series.html');
          }
        });


    });
  



  app.listen(process.env.PORT||8000, function(err){
    if (err) console.log("Error in server setup");
    console.log("Server listening on Port", 8000);
  }
  )

