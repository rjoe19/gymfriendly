var knex = require('knex') ({
  client: 'sqlite3',
  connection: {
    filename: './data/gymfriendly.sqlite'
  },
  useNullAsDefault: true
})

//removes a table added with the create table statement. for testing purposes
var dropSql = 'DROP TABLE IF EXISTS users;'

var createSql = [
    'CREATE TABLE users (',
    '  id VARCHAR(255) NOT NULL,',
    '  name VARCHAR(255) NOT NULL,',
    '  fav_training VARCHAR(255) NOT NULL,',
    '  pref_diet VARCHAR(255) NOT NULL,',
    '  my_city VARCHAR(255) NOT NULL,',
    '  password_hash VARCHAR(255) NOT NULL',

');'
  ].join(' ')

  knex.raw(dropSql).then(function (resp) {
    return knex.raw(createSql)
  }).then(function (resp) {
    process.exit()
  })
