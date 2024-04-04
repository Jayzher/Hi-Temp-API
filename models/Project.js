const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
	projectName: {
		type: String,
		required: [true, "Project Name is Required"]
	},
	description: {
		type: String,
		required: [true, "Description is Required"]
	},
	company: {
		type: String,
		required: [true, "Company Name is Required"]
	},
	address: {
		type: String,
		required: [true, "Address is Required"]
	},
	createdOn: {
		type: Date
	},
	isActive: {
		type: Boolean,
		default: true
	},
	Status: {
		type: String,
		default: "In Progress"
	},
	projExpenses:{
		type: String
	},
	DateCompleted:{
		type: Date
	},
	subTasks: [
		{
			taskId: {
				type: String,
				required: [true, "taskId Name is Required"]
			},
			taskName: {
				type: String,
				required: [true, "Task Name is Required"]
			},
			description: {
				type: String,
				required: [true, "Course Description is Required"]
			},
			destination: {
				type: String,
				required: [true, "Course Destination is Required"]
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
		}
	]
});

module.exports = mongoose.model("Project", projectSchema);