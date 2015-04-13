window.userFriendships = [];
var roomaddress, roomempty;
roomempty = true;
$(document).ready(function() {

	$.ajax({
		url: '/testroom',
		dataType: 'json',
		type: 'GET',
		success: function(data) {
			window.userFriendships = data;
		}
	});
	$("#newchatbutton").click(function(event) {
		startnewroom();
	});


	$('#splashmodal').modal('show');
});

function subscribetoroom(roomaddressinput) {
	PrivatePub.subscribe(roomaddressinput, function(data) {
		if (roomaddressinput == roomaddress) {
			//Makes sure that the user is only showned the channel that they are currently talking to.
			if (data.username == "userjoin") {
				roomempty = false;
				if (data.user1_id == "<%= @user_id %>") {
					//This means that the user is user 1
					//Therefore display user 2 infomation
					$('<li></li>').html("You have been connected with " + data.user1_name).appendTo('#chat');
					$('<li></li>').html("Their issue is " + data.user1_issue).appendTo('#chat');
					$('<li></li>').html("You have been connected with " + data.user2_name).appendTo('#chat');
					$('<li></li>').html("Their issue is " + data.user2_issue).appendTo('#chat');
				} else {
					//This means that the user is user 2
					//therefore display user 1 infomation
					$('<li></li>').html("You have been connected with " + data.user1_name).appendTo('#chat');
					$('<li></li>').html("Their issue is " + data.user1_issue).appendTo('#chat');
					$('<li></li>').html("You have been connected with " + data.user2_name).appendTo('#chat');
					$('<li></li>').html("Their issue is " + data.user2_issue).appendTo('#chat');
				}

			} else if (data.username == "lastjoin") {
				$.ajax({
					type: 'POST',
					url: '/replyuserjoin'
				});
			} else if (data.msg == "replyme") {

			} else {
				document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
				$('<li></li>').html(data.username + ": " + data.msg).appendTo('#chat');
			}
		}

	});
}

setInterval(function() {
	//The code for the checker program will go here!



}, 30000);

function namechangedfunction() {

	var username = document.getElementById('username_input').value;
	$('#nametext1').text("Your current usernamme is: " + username);
	$('#name').text(username);
	$('#namechangedtext').text("Your name has been changed to: " + username);
	$('#namechanged').modal('show');
	$('#changename').modal('hide');
}

function startnewroom() {
	var roomstatus;
	//First will need to get a roomid and return in to the class using ajax
	$.ajax({
		url: '/testroom',
		dataType: 'json',
		type: 'GET',
		success: function(data) {
			roomaddress = data.roomaddress;
			roomstatus = data.userstatus;
			alert(data + roomaddress + roomstatus);

			//Then we will subscribe to that room
			subscribetoroom(roomaddress);
			//If we are first in the room then will just wait for a msg to be sent from the other user
			//If we are second we will send a message letting the other user know that we have joined
			if (roomstatus == "First") {
				alert(roomempty);
				dotcount = 0;
				$('<li id="waitingtext"></li>').html("Waiting for user").appendTo('#chat');
				while (roomempty == true) {
					//This will be where you will let the user know that there room is empty
						//Loading text made here
						dotcount = dotcount + 1;
						if (dotcount == 6) {
							dotcount = 1;
						}
						$('#waitingtext').text("Waiting for user" + dotcountdisplay(dotcount));

				}

			} else if (roomstatus == "Second") {

			}
		}
	});


}

function dotcountdisplay(dotnumber) {
	if (dotnumber == 1) {
		"."
	} else if (dotnumber == 2) {
		".."
	} else if (dotnumber == 3) {
		"..."
	} else if (dotnumber == 4) {
		"...."
	} else if (dotnumber == 5) {
		"....."
	}
}

function wasitsentbyme(sentid) {
	if (sentid == '<%= @userid =>') {

	} else {

	}
}

function issuechangedfunction() {

	var issue = document.getElementById('issue_input').value;
	$('#issuetext1').text("Your current issue is: " + issue);
	$('#issue').text(issue);
	$('#issuechangedtext').text("Your issue has been changed to: " + issue);
	$('#issuechanged').modal('show');
	$('#changeissue').modal('hide');
}