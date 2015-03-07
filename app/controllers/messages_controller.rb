class MessagesController < ApplicationController

  def index
    temp_user_id = get_user_id
    @user_id = temp_user_id
    current_user = User.new(user_id: temp_user_id ,user_free: false)
    free_users = User.where(:user_free =>  true)
    session[:name] = current_user.user_id.to_s
    @name = "Bob"
    session[:id] = temp_user_id
      if free_users.count > 0
        #This gets the first user and starts the user_free boolean on both to false
        other_user = free_users.first
        other_user.update(user_free: false)
        current_user.update(user_free: false)
        #This then sends a message to the other user and this user to let them know that a user has been found
        temproomid = other_user.room_id
        @roomaddress = "/messages/room/" + temproomid.to_s
        session[:room] = "/messages/room/" + temproomid.to_s
       PrivatePub.publish_to @roomaddress, :username => "Helping Chat", :msg => "You have been connected with the a new user called: " + session[:name]
      @output = "Helping Chat: You have been connected to " + other_user.user_id.to_s
      else
        #No user is currently free so it waits in a private room till the user is free
        current_user.update(user_free: true)
        temproomid = get_room_id
        current_user.update(room_id: temproomid)
        @roomaddress = "/messages/room/" + temproomid.to_s
        session[:room] = "/messages/room/" + temproomid.to_s
        @output = "Waiting for user...."
      end
  end

  def new_message
    @channel = session[:room]
    @message = {:username => session[:name], :msg => params[:message]}
    respond_to do |f|
    f.js
    end
  end

  def chatreset
     current_user = User.where(:user_id => session[:id])
     current_user.update(user_free: false)
  end

  def userleft
     current_user = User.where(:user_id => session[:id])
     current_user.remove
     p "User left"
  end
  protected
  def get_user_id
    user_tempid = rand(1..100000000000000)
    if User.find_by user_id: user_tempid.nil?
      return get_user_id

    else
      return user_tempid
    end
  end

  def get_room_id
    room_tempid = rand(1..100000000000000)
    if User.find_by room_id: room_tempid.nil?
      return get_room_id

    else
      return room_tempid
    end
  end

  private
  def user_params
    params.require(:message).permit(:content)
  end
end
