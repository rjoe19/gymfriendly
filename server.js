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

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



// Define the port to run on
app.set('port', 3000);

//  set to handlebars view
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// app.use(session({
//   secret: 'ssshhhhhh! Top secret!',
//   saveUninitialized: true,
//   resave: true,
//   db: knex
// }))


// deliver files directly to the browser/serve public
app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});
