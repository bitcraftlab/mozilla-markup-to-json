// mark2json.js - @bitcraftlab 2016

var mkdirp = require('mkdirp');
var mysql = require('mysql');
var path = require('path');
var fs = require('fs');

// argument checking
var argv = process.argv.slice(2)
var argc = argv.length;

// argument parsing
if(argc >= 1 && argc <= 2) {

  // first argument = first id
  first = parseInt(argv[0]) || 0;
  // last argument = last id
  last = parseInt(argv[argc-1]) || 0;

} else {

  // usage output
  console.log('Usage: node ' + path.basename(__filename) + ' [FIRST_ID] [LAST_ID]')
  process.exit(-1);

}

// connect to mysql (no password)
var connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: ''
});
connection.connect();

// make sure the output directory exists
output = path.join(__dirname, 'output');
mkdirp(output, function (err) {
  if(err) throw err;
});

// construct SQL-query to get the marks
var query = connection.query('SELECT * FROM markup.markup_mark WHERE id BETWEEN ' + first + ' AND ' + last + ';');

query
  .on('error', function(err) {
    throw err;
  })

  // export one item
  .on('result', function(mark) {
    // turn string field to json
    mark.points_obj_simplified = JSON.parse(mark.points_obj_simplified);
    // pretty print json
    var data = JSON.stringify(mark, null, 2);
    // filename based on the ID of the database entry
    var filename = 'markup-' + ('0000000' + mark.id).slice(-7) + '.json';
    // path to the output folder
    filepath = path.join(output, filename);
    // write to file
    fs.writeFile(filepath, data, function (err) {
      if (err) throw err;

    });
    console.log('Saved ' + filename);
  })
  .on('end', function() {
    console.log('Done.');
  });

// hang up
connection.end();
