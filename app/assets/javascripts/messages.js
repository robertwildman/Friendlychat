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


function startnewroom() {
	$.ajax({
		url: '/getstartinfo',
		dataType: 'json',
		type: 'GET',
		success: function(data) {
		socket.emit('adduser',data.roomaddress,data.username);
		}
		});
}




function wasitsentbyme(sentid) {
	if (sentid == '<%= @userid =>') {

	} else {

	}
}

function namechangedfunction() {

	var username = document.getElementById('username_input').value;
	$('#nametext1').text("Your current usernamme is: " + username);
	$('#name').text(username);
	$('#namechangedtext').text("Your name has been changed to: " + username);
	$('#namechanged').modal('show');
	$('#changename').modal('hide');
}


function issuechangedfunction() {

	var issue = document.getElementById('issue_input').value;
	$('#issuetext1').text("Your current issue is: " + issue);
	$('#issue').text(issue);
	$('#issuechangedtext').text("Your issue has been changed to: " + issue);
	$('#issuechanged').modal('show');
	$('#changeissue').modal('hide');
}