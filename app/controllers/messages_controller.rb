class MessagesController < ApplicationController
  respond_to :html, :json
  def index
    if(session[:id].nil? == true)

      temp_user_id = get_user_id
      @user_id = temp_user_id
      @chatbutton = "Start new Chat"
      temp_username = "Helpuser " + temp_user_id.to_s
      @name = temp_username
      session[:id] = temp_user_id
      session[:name] = "User " + temp_user_id.to_s
      User.create(user_id: temp_user_id ,user_free: false,user_name: temp_username)
        current_user = User.where(:user_id => session[:id]).first
      free_users = User.where(:user_free =>  true)
      if free_users.count > 0
          #This gets the first user and starts the user_free boolean on both to false
          other_user = free_users.first
          other_user.update(user_free: false)
          current_user.update(user_free: false)
          #This then sends a message to the other user and this user to let them know that a user has been found
          temproomid = other_user.room_id
          @roomaddress = "/messages/room/" + temproomid.to_s
          session[:room] = "/messages/room/" + temproomid.to_s
          @channel = session[:room]
          session[:other_name] = "User " + other_user.user_id.to_s
          PrivatePub.publish_to @roomaddress, :username => "userjoin", :user1_id => current_user.user_id , :user1_name =>  current_user.user_name, :user1_issue => "Issue to be installed", :user2_id => other_user.user_id , :user2_name => other_user.user_name, :user2_issue => "Issue to be installed"
          else
          #No user is currently free so it waits in a private room till the user is free
          current_user.update(user_free: true)
          temproomid = get_room_id
          current_user.update(room_id: temproomid)
          @roomaddress = "/messages/room/" + temproomid.to_s
          session[:room] = "/messages/room/" + temproomid.to_s
          @channel = session[:room]
          @output = "You will need to wait for user to join!"
      end
    else

      current_user = User.where(:user_id => session[:id]).first
      @name = current_user.user_name
      session[:name] = current_user.user_name
      @chatbutton = "Start new Chat"
      @user_id = current_user.user_id
      free_users = User.where(:user_free =>  true)
      if free_users.count > 0
          #This gets the first user and starts the user_free boolean on both to false
          other_user = free_users.first
          other_user.update(user_free: false)
          current_user.update(user_free: false)
          #This then sends a message to the other user and this user to let them know that a user has been found
          temproomid = other_user.room_id
          @roomaddress = "/messages/room/" + temproomid.to_s
          session[:room] = "/messages/room/" + temproomid.to_s
          @channel = session[:room]
          session[:other_name] = "User " + other_user.user_id.to_s
          PrivatePub.publish_to @roomaddress, :username => "userjoin", :current_user => current_user.user_name
          else
          #No user is currently free so it waits in a private room till the user is free
          current_user.update(user_free: true)
          temproomid = get_room_id
          current_user.update(room_id: temproomid)
          @roomaddress = "/messages/room/" + temproomid.to_s
          session[:room] = "/messages/room/" + temproomid.to_s
          @channel = session[:room]
          @output = "You will need to wait for user to join!"
      end
    end
  end

  def splash
  end



  def newroom
    current_user = User.where(:user_id => session[:id]).first
    free_users = User.where(:user_free =>  true)
    if free_users.count > 0
        #This gets the first user and starts the user_free boolean on both to false
        other_user = free_users.first
        other_user.update(user_free: false)
        current_user.update(user_free: false)
        #This then sends a message to the other user and this user to let them know that a user has been found
        temproomid = other_user.room_id
        @roomaddress = "/messages/room/" + temproomid.to_s
        session[:room] = "/messages/room/" + temproomid.to_s
        PrivatePub.publish_to @roomaddress, :username => "Helping Chat", :msg => "You have been connected with the a new user called: " + other_user.user_name


    else
        #No user is currently free so it waits in a private room till the user is free
        current_user.update(user_free: true)
        temproomid = get_room_id
        current_user.update(room_id: temproomid)
        @roomaddress = "/messages/room/" + temproomid.to_s
        session[:room] = "/messages/room/" + temproomid.to_s
        flash[:output] ="Waiting for user...."
        PrivatePub.publish_to @roomaddress, :username => "Helping Chat", :msg => "You have been connected with the a new user called: " + other_user.user_name



    end
  end
  def new_message
    @channel = session[:room]
    @message = {:username => session[:name], :msg => params[:message]}
    respond_to do |f|
      f.js
    end
  end
    def got_name?
      @output = "id " + session[:id].to_s
      return false
    end
  helper_method :newuser
  helper_method :newroom

  def send_message
    PrivatePub.publish_to session[:room], :username => "send", :msg => " "
  end

  def receive_message
    PrivatePub.publish_to session[:room], :username => "receive", :msg => " "
  end
  def replyuserjoin
    PrivatePub.publish_to session[:room], :username => "userjoin", :current_user => session[:name]
    PrivatePub.publish_to session[:room], :username => "userjoin", :current_user => session[:other_name]
    render :nothing => true
  end
   helper_method :replyuserjoin
  def chatreset
     current_user = User.where(:user_id => session[:id])
     current_user.first.update(user_free: false)
  end

  def userleft
     current_user = User.where(:user_id => session[:id])
     current_user.first.remove
     p "User left"
  end
  def testmessage
      PrivatePub.publish_to session[:room], :username => "receive", :msg => " rgreg"
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
    current_user.first.update(user_issue:params[:issue])
    session[:issue] = current_user.first.user_issue
    render :nothing => true
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
