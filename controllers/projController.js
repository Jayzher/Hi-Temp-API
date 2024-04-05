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
        projectName: requestBody.projectName,
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

module.exports.updateProjectTasks = async (requestBody) => {
    try {
        if (requestBody.tasks && requestBody.tasks.projectName) {
            const project = await Project.findOne({ projectName: requestBody.tasks.projectName });

            if (!project) {
                throw new Error("Project not found");
            }

            const validStatuses = ["Completed", "In Progress", "Failed"];
            if (!validStatuses.includes(requestBody.Status)) {
                throw new Error("Invalid task status");
            }

            if (requestBody.Status === "Completed") {
                // Push the task into project's subTasks array
                project.subTasks.push(requestBody.tasks);
            } else {
                // Remove task with the same _id from project's subTasks
                project.subTasks = project.subTasks.filter(subTask => !subTask._id.equals(requestBody.tasks._id));
            }

            // Save the project
            await project.save();

            return project.subTasks;
        } else {
            throw new Error("Invalid payload: Missing tasks or projectName");
        }
    } catch (error) {
        console.error("Error updating project tasks:", error);
        throw new Error('Error updating project tasks');
    }
};

module.exports.updateProject = (reqbody) => {

    let modifyProject = {
        projectName: reqbody.projectName,
        description: reqbody.description,
        company: reqbody.company,
        address: reqbody.address,
        Status: reqbody.Status,
        Remarks: reqbody.Remarks,
        DateCompleted: new Date()
    }

    return Project.findOneAndUpdate({projectName : reqbody.projectName}, modifyProject).then((result, err) => {
        if (err) {
            return err;
        } else {
            return result;
        }
    })
}

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

module.exports.getAll = () => {
    return Project.find({}).then(result => {
        return result;
    })
}

module.exports.availableProjects = async (fullName) => {
    try {
        const result = await Project.aggregate([
            // Unwind the subTasks array
            { $unwind: "$subTasks" },
            // Group by project fields and push all subtasks into an array
            {
                $group: {
                    _id: "$_id",
                    projectName: { $first: "$projectName" },
                    description: { $first: "$description" },
                    company: { $first: "$company" },
                    address: { $first: "$address" },
                    createdOn: { $first: "$createdOn" },
                    isActive: { $first: "$isActive" },
                    Status: { $first: "$Status" },
                    Remarks: { $first: "$Remarks" },
                    projExpenses: { $first: "$projExpenses" },
                    DateCompleted: { $first: "$DateCompleted" },
                    subTasks: { $push: "$subTasks" }
                }
            }
        ]);

        return result;
    } catch (error) {
        // Handle errors, such as database query errors
        console.error('Error fetching available projects:', error);
        throw new Error('Failed to fetch available projects');
    }
};
