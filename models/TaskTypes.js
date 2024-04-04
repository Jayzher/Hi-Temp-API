const mongoose = require("mongoose");

const taskTypeSchema = new mongoose.Schema({
	department: {
		type: String,
		required: [true, "Task Name is Required"]
	},
	taskTypes: [ 
		{
			name : {
				type: String,
				required: [true, "Task Type is Required"]
			},
			description : {
				type: String,
				required: [true, "Description is Required"]
			}
		}
	]
});

module.exports = mongoose.model("TaskTypes", taskTypeSchema);