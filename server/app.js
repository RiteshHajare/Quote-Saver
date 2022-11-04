require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
var findOrCreate = require('mongoose-findorcreate')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();


app.use(bodyParser.json());

const nextDay = 1000*60*60*24;
app.use(session({
  secret:process.env.SECRET,
  saveUninitialized:true,
  cookie:{maxAge:nextDay},
  resave:false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin:"http://localhost:3000",
  methods:"GET,POST,PUT,DELETE",
  credentials:true
}));

mongoose.connect(process.env.MONGOURI);

mongoose.connection.on('connected',()=>{
  console.log("connected to mongodb atlas.");
});

mongoose.connection.on('error',(err)=>{
  console.log("error to connect mongodb atlas."+err);
});

const UserSchema = new mongoose.Schema({
  username:String,
  googleId:String,
  name: String,
  image: String,
  quotes : [{text:String,author:String}]
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);

const User = new mongoose.model("user",UserSchema);

passport.use(User.createStrategy());


var currUser;

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:4000/user",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile._json.name,profile._json.picture);

        User.findOrCreate({ username: profile.emails[0].value, googleId: profile.id, }, function (err, user) {
          user.id=profile.id;
          user.name=profile._json.name;
          user.image=profile._json.picture;
            user.save();
            currUser = user;
          return cb(err, user);
        });
  }
));
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

app.get('/auth',
  passport.authenticate('google', { scope: ['profile',"email"] }));



app.get('/user',
  passport.authenticate('google', { successRedirect:"http://localhost:3000/user"  }),
  );
app.get("/getuser",(req,res)=>{

    res.send(currUser);

})
app.get("/logout",(req,res)=>{
  req.logout((err)=>{
    // console.log("sxsx");
  });
  res.redirect("http://localhost:3000");
})

app.post("/getdatabase",(req,res)=>{
  User.findOne({googleId:req.body.id},(err,userr)=>{
    // console.log(userr);
    res.json(userr);

  })
})

app.post("/setquote",(req,res)=>{
  const {quote,user} = req.body;
// console.log(quote,user);
  User.findOne({googleId:user},(err,user)=>{
    // console.log(user);
    user.quotes.push(quote);
    user.save();
  })
})

app.post("/removequote",(req,res)=>{
  const {quote,user} = req.body;

  User.findOne({googleId:user},(err,userr)=>{
    // console.log(user);
    const newarr = userr.quotes.filter((quot) => {
          return quot.text!=quote.text;
      })
    userr.quotes = newarr;

    userr.save();
  })
})

app.listen("4000",()=>{
  console.log("server is running on port 4000");
});
