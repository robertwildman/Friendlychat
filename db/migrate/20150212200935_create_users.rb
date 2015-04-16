class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
		  t.bigint :user_id
    	t.bigint  :room_id
    	t.boolean :user_free
    	t.string  :user_name
    	t.string  :user_issue
      	t.timestamps
    end
  end
end
