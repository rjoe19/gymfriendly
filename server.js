// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var express = require('express');
var path = require('path');
var app = express();
var exphbs  = require('express-handlebars');
var fs = require('fs');
var dotenv = require('dotenv')
var bodyParser = require('body-parser'); //parses the body of the response
var bcrypt = require('bcrypt');
var uuid = require('node-uuid'); //creates unique id for user
var session = require('express-session')


//SETUP MIDDLEWARE
//===========================================================================

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())




// SETUP SERVER AND PORT LISTENING
//=========================================================================

// Define the port to run on
app.set('port', 3000);

//  set to handlebars view
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './data/gymfriendly.sqlite'
  },
  useNullAsDefault: true
})

app.use(session({
  secret: 'ssshhhhhh! Top secret!',
  saveUninitialized: true,
  resave: true,
  db: knex
}))


// deliver files directly to the browser/serve public
// app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});


// SETUP ROUTING
// ===============================================================================

app.get('/', function (req, res, next) {
    res.render('home', {layout: false});
});

app.route('/sign-up')
  .get(function (req, res) {
    res.render('sign-up')
  })
  .post(urlencodedParser, function (req, res) {
    console.log("this is the req", req.body)
    var password = req.body.password
    console.log("THIS IS THE PASSWORD FROM REQ.BODY", password)
    bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      var toDb = req.body
      toDb.password_hash = hash //creating new key password_has in todb object
      toDb.id = uuid.v1()
      delete toDb.password
      console.log("HERE IS THE ID",toDb.id )
      knex('users').insert(toDb).then(function (resp) {
        console.log("THIS IS A RESPONSE FROM KNEX")
        req.session.userId = toDb.id      //auth session id equates to db
        res.redirect('/')
      })
    })
  });
})

app.route('/sign-in')
  .get(function (req, res) {
    res.render('sign-in')
  })
  .post(urlencodedParser, function (req, res) {
    console.log(req.body)
    var email = req.body.email
    var password = req.body.password
    knex('users').where('email', email).then( function (resp) {
    console.log("response from sql lite", resp)
     bcrypt.compare(password, resp[0].password_hash, function(err, resp){
        if (resp === true) {
          req.session.userId == resp[0].id   //auth session id equates to db
           res.redirect('/')
        }
        else {
         res.render('sign-in', {message: "Login failed, please try again"})
         }
       });
      })
    })

 // Logout endpoint
app.get('/sign-out', function (req, res) {
    res.render('sign-out')
  // Add logout code here
  req.session.destroy()
})
