window.userFriendships = [];
var roomaddress, roomempty;
roomempty = true;
userconnected = false;

$(document).ready(function() {
	$('#messagesend').click( function() {
			var message = $('#messagetextinput').val();
			$('#messagetextinput').val('');
			// tell server to execute 'sendchat' and send along one parameter
			if(userconnected == false)
			{
				alert("You need to start chat before you can send messages!");
			}else
			{
			socket.emit('sendchat', message);
			$(this).focus();
			}
		});

		// when the client hits ENTER on their keyboard
		$('#messagetextinput').keypress(function(e) {
			if(e.which == 13) {
				$(this).blur();
				$('#messagesend').focus().click();
				$(this).focus();
			}
		});
		$('.pickiconcircle').click(function() {
			$('#currentprofilepicture').removeClass();
			var selectedicon =  this.id;
			var selectedcolor = $('.pickcolorselected').attr('id');
			$('.pickiconcircle').removeClass().addClass('pickcircle pickiconcircle ' + selectedcolor);
			$('#'+selectedicon).addClass('pickiconselected');
			$('#currentprofilepicture').addClass('pickcircle '+selectedicon+' '+selectedcolor);

		});
		$('.pickcolorcircle').click(function() {
			$('.pickcolorcircle').removeClass().addClass('pickcircle pickcolorcircle');
			$('#currentprofilepicture').removeClass();
			var selectedcolor =  this.id;
			var selectedicon = $('.pickiconselected').attr('id');
			$('.pickiconcircle').removeClass().addClass('pickcircle pickiconcircle ' + selectedcolor);
			$('#'+selectedicon).addClass('pickiconselected');
			$('#'+selectedcolor).addClass('pickcolorselected');
			$('.pickiconcircle').addClass(selectedcolor);
			$('#currentprofilepicture').addClass('pickcircle '+selectedicon+' '+selectedcolor);
		});
});


function startnewroom() {
	$.ajax({
		url: '/getstartinfo',
		dataType: 'json',
		type: 'GET',
		success: function(data) {
		if(userconnected == true)
			{
				//User is currently in a chat
				$('#chat').html('');
				userconnected = true;
				socket.emit('switchRoom',data.roomaddress,$('#issue').text(),data.roomstatus);
			}else{
				$('#chat').html('');
				userconnected = true;
				socket.emit('adduser',data.roomaddress,data.username,$('#issue').text(),data.roomstatus);
			}
			//This will display 2 buttons and remove the staret chatting button
			//First button is View Person Second is new Person
			$(".startchatbutton").remove();
			$("#chatbuttons").append("<input type=\"button\"  value=\"View Person\" onclick=\"viewperson()\" class=\"btn startchatbutton chat-button\"/>");
			$("#chatbuttons").append("<input type=\"button\"  value=\"New Person\" onclick=\"startnewroom()\" class=\"btn startchatbutton chat-button\"/>");

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
	socket.emit('updatename', username);
}


function issuechangedfunction() {

	var issue = document.getElementById('issue_input').value;
	$('#issuetext1').text("Your current issue is: " + issue);
	$('#issue').text(issue);
	$('#issuechangedtext').text("Your issue has been changed to: " + issue);
	$('#issuechanged').modal('show');
	$('#changeissue').modal('hide');
	socket.emit('updateissue', issue);
}