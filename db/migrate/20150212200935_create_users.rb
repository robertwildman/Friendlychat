class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
		t.integer :user_id
    	t.integer :room_id
    	t.boolean :user_free
      	t.timestamps
    end
  end
end
