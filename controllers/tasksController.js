const Tasks = require("../models/Tasks.js");
const Users = require("../models/Users.js");
const Project = require("../models/Project.js");
const TaskTypes = require("../models/TaskTypes.js");

function formatDate(date) {
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = date.getDate();
    day = day < 10 ? '0' + day : day;
    let year = date.getFullYear();

    let hours = date.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return month + '-' + day + '-' + year + ' ' + hours + ':' + minutes;
}

// Controller to create a standalone task
module.exports.createTask  = async (requestBody) => {
    let now = new Date();
    let formattedDate = formatDate(now);

    try {
        // Create new task
        let newTask = new Tasks({
            description: requestBody.description,
            destination: requestBody.destination,
            duration: requestBody.duration,
            createdOn: formattedDate,
            taskType: requestBody.taskType,
            department: requestBody.department,
            travelFunds: requestBody.travelFunds,
            expenses: requestBody.expenses,
            refund: requestBody.refund,
            assignedTo: [{ fullName: requestBody.fullName }]
        });

        if (requestBody.projectName !== "Select Project") {
            newTask.projectName = requestBody.projectName;
        }


        // Save the new task in the Task schema
        await newTask.save();

        return newTask; // Return the new task
    } catch (err) {
        console.error("Error creating standalone task:", err);
        throw err; // Re-throw the error to be handled by the caller
    }
};



getTaskId = async (id) => {
    return await Tasks.findById(id, {_id: 1}).then((result, err) => {
        if (err) {
            console.log(err);
            return err;
        } else {
            console.log(result);
            return result;
        }
    })
}

getIncrement = async (fullName) => {
    await Users.findOne({name : fullName}).then(results => {
        if (results.Tasks.length == 0 ||  results.Tasks.length == null) {
            return 1;
        } else {
            return results.Tasks.length + 1;
        }
    })
}

getTaskName = async (id) => {
    return await Tasks.findById(id, {name: 1}).then(result => {
        return result;
    })
}

module.exports.assignTo = async (reqbody) => {
    try {
        const user = await Users.findOne({ name: reqbody.fullName });
        const task = await Tasks.findOne({ _id: reqbody.id });

        if (!user || !task) {
            throw new Error('User or task not found');
        }

        // Remove task from other users who may have it assigned
        await Users.updateMany({ 'Tasks.objectId': reqbody.id }, { $pull: { Tasks: { objectId: reqbody.id } } });

        const Increment = user.Tasks.length === 0 ? 1 : user.Tasks.length + 1;

        const newTask = {
            objectId: reqbody.id,
            taskType: task.taskType,
            active: reqbody.active,
            assignedId: Increment
        };

        user.Tasks.push(newTask);
        await user.save();

        return Users.findOne({ name: reqbody.fullName });
    } catch (error) {
        throw new Error('Error assigning task: ' + error.message);
    }
};

module.exports.setTaskActive = async (reqbody) => {
    try {   
        const result = await Users.findOneAndUpdate(
            { 'Tasks.objectId': reqbody.id }, 
            { $set: { 'Tasks.$.active': reqbody.active } }, 
            { new: true }
        );

        return result;
    } catch (error) {
        console.error("Error:", error);
        throw new Error('Error setting task active status');
    }
};


module.exports.getAll = () => {
	return Tasks.find({}).then(result => {
		return result;
	})
}

module.exports.availableProducts = async (reqBody) => {
    const fullName = reqBody.fullName; // Assuming fullName is passed in reqBody

    try {
        const result = await Users.aggregate([
            { $match: { 'name': fullName, 'Tasks.active': true } },
            { $project: { activeTasks: { $filter: { input: '$Tasks', as: 'task', cond: { $eq: ['$$task.active', true] } } } } }
        ]);

        return result;
    } catch (error) {
        // Handle errors, such as database query errors
        console.error('Error fetching available products:', error);
        throw new Error('Failed to fetch available products');
    }
};



module.exports.updateTask = (reqbody) => {

    let modifyTask = {
        taskName: reqbody.taskName,
        description: reqbody.description,
        destination: reqbody.destination,
        duration: reqbody.duration,
        taskType: reqbody.taskType,
        department : reqbody.department,
        travelFunds : reqbody.travelFunds,
        expenses : reqbody.expenses,
        refund : reqbody.refund,
        assignedTo: [{
            fullName: reqbody.assignedTo
        }],
        Status : reqbody.Status,
        DateCompleted: reqbody.DateCompleted
    }

    return Tasks.findOneAndUpdate({tasksId : reqbody.tasksId}, modifyTask).then((result, err) => {
        if (err) {
            return err;
        } else {
            return result;
        }
    })
}

module.exports.archiveTask = (paramsId, task) => {

    return Tasks.findByIdAndUpdate(paramsId.taskId, {isActive : task.isActive}).then((result, err) => {
        if (err) {
            return false;
        } else {
            return result;
        }
    })
}

module.exports.getTask = (reqbody) => {
    return Tasks.findOne({tasksId: reqbody.tasksId}).then((result, err) => {
        if(err) {
            return err;
        } else {
            return result;
        }
    })
}

module.exports.getTaskById = (reqbody) => {
    return Tasks.findOne({_id: reqbody.id}).then((result, err) => {
        if(err) {
            return err;
        } else {
            return result;
        }
    })
}

module.exports.addTaskType = async (reqbody) => {
    // Retrieve task types based on the provided department
    const tasktypes = await TaskTypes.findOne({ department: reqbody.department });

    // Create a new task type object
    const newTaskType = {
        name: reqbody.name,
        description: reqbody.description
    };

    // Add the new task type to the taskTypes array
    tasktypes.taskTypes.push(newTaskType);

    // Save the changes to the database
    await tasktypes.save();

    // Return the updated tasktypes object
    return tasktypes;
};

module.exports.addDepartment = (reqbody) => {
    const department = new TaskTypes({
        department: reqbody.department
    })

    return department.save().then((result, err) => {
        if (err) {
            return false;
        } else {
            return true;
        }
    })
}




