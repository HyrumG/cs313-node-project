function callAjax(url, callback) {
	var xmlObj = new XMLHttpRequest();
	xmlObj.onreadystatechange = function () {
		if (xmlObj.readyState == 4 && xmlObj.status == 200) {
			callback(xmlObj.responseText);
		}
	}
	xmlObj.open("GET", url, true);
	xmlObj.send();
}

function getLastDiapers() {
	console.log("Searching...");

	var fname = document.getElementById("fnameView").value;
	var lname = document.getElementById("lnameView").value;

	console.log("First: ", fname);
	console.log("Last: ", lname);

	var url = "/getLastDiapers?name=" + fname + " " + lname;
    console.log("The url before calling ajax is: ", url);
	callAjax(url, handleResultGetDiapersList)
}

function handleResultGetDiapersList(results) {
	console.log("Back from AJAX with result: ");
	console.log(results);
  
    var formatHTML = "";
    
    var myObj = JSON.parse(results);
    console.log("Outside loop, name is: ", myObj[1].name);
    
    var x;
    for (var i = 0; i < myObj.length; i++) {
			var name = myObj[i].name;
            var lastChanged = myObj[i].last_changed;
            var status = myObj[i].status;
            console.log("Inside for loop name is: ", name);
            console.log("Inside for loop last changed is: ", lastChanged);
            console.log("Inside for loop status is: ", status);
        
            formatHTML += "Name: " + name + ", Last Changed on " + lastChanged + ", status: " + status + "<br>";
		}
    document.getElementById("diaperResult").innerHTML = formatHTML;
}