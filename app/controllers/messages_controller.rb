class MessagesController < ApplicationController
 def index
  temp_user_id = get_user_id
  @user_id = temp_user_id
  current_user = User.new(user_id: temp_user_id ,user_free: false)
  free_users = User.where(:user_free =>  true)
  session[:name] = current_user.user_id.to_s
  @error = free_users.count
    if free_users.count > 0
    other_user = free_users.first
    other_user.update(user_free: false)
    current_user.update(user_free: false)
    temproomid = other_user.room_id
    @roomaddress = "/messages/room/" + temproomid.to_s
    @output = "User found"
    else
      current_user.update(user_free: true)
      temproomid = get_room_id
      current_user.update(room_id: temproomid)
      @roomaddress = "/messages/room/" + temproomid.to_s
      session[:room] = "/messages/room/" + temproomid.to_s
      @output = "Waiting for user"
    end
 end

  def new_message
    @channel = session[:room]
    @message = {:username => session[:name], :msg => params[:message]}
    respond_to do |f|
    f.js
    end
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
