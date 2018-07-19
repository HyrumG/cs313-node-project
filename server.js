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
//  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('views/form'))
  .get('/getLastDiapers', getLastDiapers)
  .post('/insertDiaper', insertDiaper)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

function getLastDiapers(req, res) {

	var name = req.query.name;
	console.log("The name inside of server.js getLastDiapers is: " + name);
	// TODO: We should really check here for a valid id before continuing on...

	// use a helper function to query the DB, and provide a callback for when it's done
	getLastDiapersFromDb(name, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		if (error || result == null) {
			res.status(500).json({success: false, data: error});
		} else {
			var person = result[0];
			res.status(200).json(result);
		}
	});
}

function getLastDiapersFromDb(name, callback) {
	console.log("Getting person from DB with name: " + name);

//	var sql = "SELECT * FROM parent WHERE name = $1";
    var sql = "SELECT p.name, dc.last_changed, ds.status FROM diaper_change dc INNER JOIN parent p ON dc.parent_id=(SELECT id FROM parent WHERE name=$1) INNER JOIN diaper_status ds ON ds.id=dc.status_id WHERE p.name=$1";
	var params = [name];

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

function insertDiaper(req, res) {
    var fname = req.body.insertFirst;
    var lname = req.body.insertLast;
    var name = fname + " " + lname;
    
    var tempChangeTime = req.body.changeTime;
    var changeTime = tempChangeTime.replace("T", " ");
    
    var diaperStatus = req.body.diaperStatus;
    
    console.log("First Name is: ", fname);
    console.log("Last Name is: ", lname);
    console.log("Name is: ", name);
    console.log("Change Time is: ", changeTime);
    console.log("Diaper Status is: ", diaperStatus);
    
    // This assumes that the parent already exists
    // Create an sql to SELECT the parents id 
    
//    var sql = "INSERT INTO diaper_change (last_changed, parent_id, status_id) VALUES ($1, ('SELECT id FROM parent WHERE name=$2'), $3)";
//    
////    var sql = "SELECT id FROM parent WHERE name=$1";
//    var params = [changeTime, name, diaperStatus];
//    
////    var params = [diaperStatusID]
//  
//    pool.query(sql, paramsParentID, function(err, result) {
//       if (err) {
//            console.log("Error inserting with existing parent.");
//            console.log(err);
//       } else {
//           // Maybe redirect to a page that will show their history
//       }
//    });
    
    
      // This assumes that the parent does not already exist
    var sqlNewParent = "INSERT INTO parent (name) VALUES ($1) RETURNING id"; 
    
    var params = [name]
     // This is to insert into diaper_change if it is a new parent
     // The sql is to insert a new parent and get a new id
    pool.query(sqlNewParent, params, function (err, result) {
        if (err) {
            console.log("Error inserting with returning.");
            console.log(err);
        }
        else {
            console.log("The id of the newly inserted parent is: ", result.rows[0].id);
            var parentID = result.rows[0].id;
            var sql2 = "INSERT INTO diaper_change (last_changed, parent_id, status_id) VALUES ($1, $2, $3)"
    
              var params2 = [changeTime, parentID, diaperStatus];
            // Query to insert into diaper_change with the status and date from the req
            pool.query(sql2, params2, function (err, result) {
                if (err) {
                      console.log("Error inserting with returning.");
                      console.log(err);   
                } else {
                    // Maybe redirect to a page that will show their history
                    res.json(result.rows);
                }
            });
        }
    });
}








