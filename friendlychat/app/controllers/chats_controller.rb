class ChatsController < ApplicationController
  def create
    @chat = Chat.new(params[:content])
    PrivatePub.publish_to("/messages/new", "alert('#{@chat.content}');")
    render 'create'
  end
end
