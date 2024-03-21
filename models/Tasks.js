const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Task Name is Required"]
	},
	description: {
		type: String,
		required: [true, "Course Description is Required"]
	},
	duration: {
		type: String,
		required: [true, "Task Duration is Required"]
	},
	createdOn: {
		type: Date
	},
	isActive: {
		type: Boolean,
		default: true
	},
	taskType: {
		type: String,
		required: [true, "Task Type is Required"]
	},
	Status: {
		type: String,
		default: "In Progress"
	},
	department: {
		type: String,
		required: [true, "Department is Required"]
	},
	travelFunds:{
		type: String,
		required: [true, "Travel Funds is Required"]
	},
	expenses:{
		type: String,
	},
	refund:{
		type: String,
	},
	assignedTo: [
		{
			fullName: {
				type: String,
				required: [true, "Name is Required"]
			},
			assignedOn: {
				type: Date,
				default: new Date()
			}
		}
	]
});

module.exports = mongoose.model("Tasks", taskSchema);