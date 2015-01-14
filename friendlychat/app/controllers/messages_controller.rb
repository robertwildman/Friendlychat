class MessagesController < ApplicationController
 def index
 	Message.delete_all
 	@usernumber = 12
    @messages = Message.all
  end

  def create
    @message = Message.create!(user_params)
    @useraddress = "/messages/new/12"
  end

  private
  def user_params
    params.require(:message).permit(:content)
  end
end
