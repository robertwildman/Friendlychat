class MessagesController < ApplicationController
  respond_to :html, :json

  def getstartinfo
    #This will return all the starting infomation needed.
    if(session[:id].nil? == true)
      temp_user_id = get_user_id
      temp_username = "Helpuser " + temp_user_id.to_s
      session[:id] = temp_user_id
      session[:name] = "User " + temp_user_id.to_s
      User.create(user_id: temp_user_id ,user_free: false,user_name: temp_username)
      current_user = User.where(:user_id => session[:id]).first
    else
      current_user = User.where(:user_id => session[:id]).first
      if current_user.nil?
        temp_user_id = get_user_id
        session[:id] = temp_user_id
        if session[:issue].nil?
          User.create(user_id: temp_user_id ,user_free: false,user_name: session[:name])
        else
          User.create(user_id: temp_user_id ,user_free: false,user_name: session[:name],user_issue: session[:issue])
        end
        current_user = User.where(:user_id => session[:id]).first
      end
      @name = current_user.user_name
    #Will find if there is a free room or not
    free_users = User.where(:user_free =>  true)
        if free_users.count > 0
          #This gets the first user and starts the user_free boolean on both to false
          other_user = free_users.first
          other_user.update(user_free: false)
          current_user.update(user_free: false)
          #This then sends a message to the other user and this user to let them know that a user has been found
          roomid = other_user.room_id
          session[:room] = "/messages/room/" + roomid.to_s
          @channel = session[:room]
          status = "Full"
        else
          #No user is currently free so it waits in a private room till the user is free
          current_user.update(user_free: true)
          roomid = get_room_id
          current_user.update(room_id: roomid)
          session[:room] = "/messages/room/" + roomid.to_s
          @channel = session[:room]
          status = "Empty"
        end
        @roominfo = Room.new(session[:room],current_user.user_name,status)
        respond_with @roominfo
    end

    end
    def index
      if(session[:id].nil? == true)
        temp_user_id = get_user_id
        temp_username = "Helpuser " + temp_user_id.to_s
        @user_id = temp_user_id
        @name = temp_username
        @users = User.all
        session[:id] = temp_user_id
        session[:name] = "User " + temp_user_id.to_s
        User.create(user_id: temp_user_id ,user_free: false,user_name: temp_username)
        current_user = User.where(:user_id => session[:id]).first
      else
        current_user = User.where(:user_id => session[:id]).first
        if current_user.nil?
          temp_user_id = get_user_id
          session[:id] = temp_user_id
          if session[:issue].nil?
            User.create(user_id: temp_user_id ,user_free: false,user_name: session[:name])
          else
            User.create(user_id: temp_user_id ,user_free: false,user_name: session[:name],user_issue: session[:issue])
          end
          current_user = User.where(:user_id => session[:id]).first
        else
      end
        @name = current_user.user_name
        @issue = current_user.user_issue
        @user_id = current_user.user_id
        @users = User.all
      end
    end

    def newroom
    #This will deal with the user restarting a room
    #The user will have been signed in before hand
    #Will find if there is a free room or not
    current_user = User.where(:user_id => session[:id]).first
    free_users = User.where(:user_free =>  true)
    if free_users.count > 0
      #This gets the first user and starts the user_free boolean on both to false
      other_user = free_users.first
      other_user.update(user_free: false)
      current_user.update(user_free: false)
      #This then sends a message to the other user and this user to let them know that a user has been found
      roomid = other_user.room_id
      session[:room] = "/messages/room/" + roomid.to_s
      @channel = session[:room]
      status = "Full"
    else
      #No user is currently free so it waits in a private room till the user is free
      roomid = get_room_id
      current_user.update(user_free: true)
      current_user.update(room_id: roomid)
      session[:room] = "/messages/room/" + roomid.to_s
      @channel = session[:room]
      status = "Empty"
    end
    @roominfo = Room.new(session[:room],status)
    respond_with @roominfo
    end

    def got_issue?
      return session[:issue].present?
    end
    helper_method :newuser
    helper_method :newroom
    helper_method :got_issue?
    helper_method :got_name?
    helper_method :replyuserjoin

    def chatreset
     current_user = User.where(:user_id => session[:id])
     current_user.first.update(user_free: false)
   end

   def userleft
     current_user = User.where(:user_id => session[:id])
     current_user.first.remove
   end

  def changename
    current_user = User.where(:user_id => session[:id])
    current_user.first.update(user_name:params[:name])
    @name = current_user.first.user_name
    session[:name] = current_user.first.user_name
    render :nothing => true
  end

  def changeissue
    current_user = User.where(:user_id => session[:id])
    current_user.first.update(user_issue: params[:issue])
    session[:issue] = current_user.first.user_issue
    render :nothing => true
  end

  protected
  def get_user_id
    user_tempid = rand(1..10000000)
    userlist = User.find_by user_id: user_tempid
    if userlist.nil?
      return user_tempid

    else
     get_user_id
   end
 end
 def get_room_id
  room_tempid = rand(1..10000000)
  roomlist =  User.find_by room_id: room_tempid
  if roomlist.nil?
    return room_tempid
  else
    get_room_id

  end
end

private
def user_params
  params.require(:message).permit(:content)
end
end
