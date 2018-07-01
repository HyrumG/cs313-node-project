const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || "postgres://caregiver:responsible@localhost:5432/nodeproject";

const pool = new Pool({connectionString: connectionString});

app.set("port", (process.env.PORT || 5000))
  .use(express.json())
	.use(express.urlencoded( {extended: true} ))
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('views/index'))
  .get('/getLastDiapers', getLastDiapers)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

function getLastDiapers(req, res) {

	var id = req.query.id;
	console.log("The id is: " + id);
	// TODO: We should really check here for a valid id before continuing on...

	// use a helper function to query the DB, and provide a callback for when it's done
	getLastDiapersFromDb(id, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		if (error || result == null) {
			res.status(500).json({success: false, data: error});
		} else {
			var person = result[0];
			res.status(200).json(result[0]);
		}
	});
}

function getLastDiapersFromDb(id, callback) {
	console.log("Getting person from DB with id: " + id);

	var sql = "SELECT * FROM parent WHERE id = $1::int";

	var params = [id];

	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));
		// console.log(result.rows);

		// (The first parameter is the error variable, so we will pass null.)
		callback(null, result.rows);
	});

} // end of getPersonFrom