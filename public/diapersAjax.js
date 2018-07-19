function callAjaxGet(url, callback) {
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
	callAjaxGet(url, handleResultGetDiapersList)
}

function handleResultGetDiapersList(results) {
	console.log("Back from AJAX with result: ");
	console.log(results);
  
    var formatHTML = "";
    
    var myObj = JSON.parse(results);
    console.log("Outside loop, name is: ", myObj[0].name);
    
    var x;
    for (var i = 0; i < myObj.length; i++) {
			var name = myObj[i].name;
            var lastChanged = myObj[i].last_changed.replace("T", " ");
            lastChanged = lastChanged.slice(0, lastChanged.lastIndexOf("."));
            var status = myObj[i].status;
            console.log("Inside for loop name is: ", name);
            console.log("Inside for loop last changed is: ", lastChanged);
            console.log("Inside for loop status is: ", status);
        
            formatHTML += "Name: " + name + ", Last Changed on " + lastChanged + ", status: " + status + "<br>";
		}
    document.getElementById("diaperResult").innerHTML = formatHTML;
}

function callAjaxPost() {
    var dataToSend = { 
        insertFirst: $("#insertFirst").val(),
        insertLast: $("#insertLast").val(),
        changeTime: $("#changeTime").val(),
        diaperStatus: $("#diaperStatus").val()};
    
    console.log(dataToSend.insertFirst);
    console.log(dataToSend.insertLast);
    console.log(dataToSend.changeTime);
    console.log(dataToSend.diaperStatus);
    
    $.ajax({type: 'POST',
            data: JSON.stringify(dataToSend),
            contentType: 'application/json',
            url: '/insertDiaper',				
            success: function(dataBack) {
                console.log('success');
                console.log(JSON.stringify(dataBack));
                handleResultPost(dataToSend);
                    }
            });
}

function handleResultPost(data) {
    var url = "/getLastDiapers?name=" + data.insertFirst + " " + data.insertLast;
    console.log("The url in handleResultPost is: ", url);
//    console.log("The url before calling ajax is: ", url);
	callAjaxGet(url, handleResultGetDiapersList)
}