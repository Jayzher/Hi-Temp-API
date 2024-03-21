const Tasks = require("../models/Tasks.js");
const Users = require("../models/Users.js");

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

module.exports.createTask = (requestBody) => {
    let now = new Date();
    let formattedDate = formatDate(now);

    let newTasks = new Tasks({
        name: requestBody.name,
        description: requestBody.description,
        duration: requestBody.duration,
        createdOn: formattedDate,
        taskType: requestBody.taskType,
        department: requestBody.department,
        travelFunds: requestBody.travelFunds,
        expenses: requestBody.expenses,
        refund: requestBody.refund,
        assignedTo: [{ fullName: requestBody.fullName }]
    });

    return newTasks.save()
        .then((task) => {
            return task; // Return the saved task if successful
        })
        .catch((err) => {
            console.error("Error saving task:", err);
            throw err; // Re-throw the error to be handled by the caller
        });
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
    // const task = await getTaskId(reqbody.id);
    // console.log(task + "assign to");
    const user = await Users.findOne({name : reqbody.fullName});
    const taskname = await Tasks.findOne({_id : reqbody.id});
    const Increment = await Users.findOne({name : reqbody.fullName}).then(results => {
        if (results.Tasks.length == 0 ||  results.Tasks.length == null) {
            return 1;
        } else {
            return results.Tasks.length + 1;
        };
    })

    const newTasks = {
        objectId: reqbody.id,
        name: taskname.name,
        assignedId: Increment
    }

    console.log(newTasks);

    user.Tasks.push(newTasks);
    user.save();
    return Users.findOne({name : reqbody.fullName});
    // .then((result, err) => {
    //     if (err) {
    //         return err;
    //     } else {
    //         return result;
    //     }
    // })
}

module.exports.getAll = () => {
	return Tasks.find({}).then(result => {
		return result;
	})
}

module.exports.availableProducts = () => {
    return Tasks.find({isActive: true}).then(result => {
        return result;
    })
}

module.exports.updateTask = (reqbody) => {

    let modifyTask = {
        name: reqbody.name,
        description: reqbody.description,
        duration: reqbody.duration,
        taskType: reqbody.taskType,
        department : reqbody.department,
        travelFunds : reqbody.travelFunds,
        expenses : reqbody.expenses,
        refund : reqbody.refund,
        Status : reqbody.Status
    }

    return Tasks.findOneAndUpdate({tasksId : reqbody.tasksId}, modifyTask).then((result, err) => {
        if (err) {
            return false;
        } else {
            return true;
        }
    })
}

module.exports.archiveTask = (paramsId, task) => {

    return Tasks.findByIdAndUpdate(paramsId.taskId, {isActive : task.isActive}).then((result, err) => {
        if (err) {
            return false;
        } else {
            return true;
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

