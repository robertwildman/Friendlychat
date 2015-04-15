window.userFriendships = [];
var roomaddress, roomempty;
roomempty = true;

$(document).ready(function() {

	$("#newchatbutton").click(function(event) {
		  socket.emit('adduser');
	});
	$('#messagesend').click( function() {
			var message = $('#messagetextinput').val();
			$('#messagetextinput').val('');
			// tell server to execute 'sendchat' and send along one parameter
			socket.emit('sendchat', message);
		});

		// when the client hits ENTER on their keyboard
		$('#messagetextinput').keypress(function(e) {
			if(e.which == 13) {
				$(this).blur();
				$('#messagesend').focus().click();
				$(this).focus();
			}
		});

	// when the client clicks SEND


	$('#splashmodal').modal('show');
});

function subscribetoroom(roomaddressinput) {
	alert("You have been subscribeed to " + roomaddressinput);
	$('#Privatepub').append(" <%= subscribe_to" + "/public" + "=>")   ;
	PrivatePub.subscribe("/public", function(data, channel) {
		alert("inpout");

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
			} else if (data.username == "Joinedinfo") {
				window.joinedinput = data;
				$('<li></li>').html("User 1 id " + data.user1_id).appendTo('#chat');
				$('<li></li>').html("User 2 id " + data.user2_id).appendTo('#chat');

			} else {
				document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
				$('<li></li>').html(data.username + ": " + data.msg).appendTo('#chat');
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
	$.ajax({
		url: '/getstartinfo',
		dataType: 'json',
		type: 'GET',
		success: function(data) {
		socket.emit('adduser',data.roomaddress,data.username);
		}
		});

	var roomstatus;
	//First will need to get a roomid and return in to the class using ajax
	subscribetoroom("/public");
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
			} else if (roomstatus == "Second") {
				//Will send a reply message to the user
				$.ajax({
				url: '/sendjoinedmsg',
				data : {roomaddress: data.roomaddress ,user1_id: data.user1_id , user2_id: data.user2_id},
				type: 'POST',
				success: function(data) {
				}
				});
			}
		}
	});


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