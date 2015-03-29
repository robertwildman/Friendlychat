class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
		t.integer :user_id
    	t.integer :room_id
    	t.boolean :user_free
    	t.string  :user_name
    	t.string  :user_issue
      	t.timestamps
    end
  end
end
