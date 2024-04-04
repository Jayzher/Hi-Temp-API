const Tasks = require("../models/Tasks.js");
const Users = require("../models/Users.js");
const Project = require("../models/Project.js");

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

module.exports.createProject = (requestBody) => {
    let now = new Date();
    let formattedDate = formatDate(now);

    let newProj = new Project({
        projectName: requestBody.name,
        description: requestBody.description,
        company: requestBody.company,
        address: requestBody.address,
        createdOn: formattedDate
    });

    return newProj.save()
        .then((proj) => {
            return proj; // Return the saved task if successful
        })
        .catch((err) => {
            console.error("Error saving Project:", err);
            throw err; // Re-throw the error to be handled by the caller
        });
};

module.exports.subTask = async (reqbody) => {
    return await Project.findOne({ _id: reqbody.id }).then(results => {

        if (!results) {
            throw new Error('Project not found!');
        }

        results.subTasks.push(reqbody.subTask);
        results.save().then((res, err) => {
            if (err) {
                return err;
            } else {
                return res;
            }
        })
    })   
};

module.exports.checkIfProjectExists = (requestBody) => {
    return Project.find({projectName: requestBody.projectName}).then(result => {
        if(result.length > 0) {
            return true;
        } else {
            return false;
        }
    })
};
