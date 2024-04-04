const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	profile: {
		type: String,
		default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
	},
	Status: {
		type: Boolean,
		default: false
	},
	name: {
		type: String,
		required: [true, "First Name is Required"]
	},
	username: {
		type: String,
		required: [true, "username is Required"]
	},
	department: {
		type: String,
		required: [true, "Department is Required"]
	},
	role: {
		type: String,
		default: "Employee"
	},
	password: {
		type: String,
		required: [true, "Password is Required"]
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	Tasks: [
		{
			objectId: {
				type: String
			},
			taskName: {
				type: String
			},
			assignedId: {
				type: String
			},
			assignedOn: {
				type: String
			},
			active: {
				type: Boolean,
				default: true
			}
		}
	]
})

module.exports = mongoose.model("Users", userSchema);