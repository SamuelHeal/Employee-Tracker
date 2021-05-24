const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const connection = require('../config/connection');


const start = async () => {
    allManagers()
    allDepartments()
    allRoles()
    return await inquirer.prompt({
        name: 'start',
        type: 'list',
        message: 'What action would you like to take?',
        choices: [
            'View Employees',
            'View Departments',
            'View Roles',
            'Add Employee',
            'Add Department',
            'Add Role',
            'Update Employee Role',
            'Exit',
        ],
    }).then((response) => {
        switch (response.start) {
            case 'View Employees':
                // addDepartment();
                break;
            case 'View Departments':
                // addRole();
                break;
            case 'View Roles':
                // addEmployee();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Department':
                // viewRoles();
                break;
            case 'Add Role':
                // viewEmployees();
                break;
            case 'Update Employee Role':
                console.log("Update Employee Role");
                break;
            case 'Exit':
                // exitProgram();
                break;
        }
        });
};

const managerArray = []
const managerIDs = []
const allManagers = async () => {
    const theManagers = await connection.query('SELECT * FROM managers', (err, results) => {
            if (err) throw err;
            results.forEach(({ manager_name, id }) => {
                managerArray.push(manager_name)
                managerIDs.push(id)
            });
    });
    
}

const departmentArray = []
const departmentIDs = []
const allDepartments = async () => {
    const theDepartments = await connection.query('SELECT * FROM departments', (err, results) => {
            if (err) throw err;
            results.forEach(({ department_name, id }) => {
                departmentArray.push(department_name)
                departmentIDs.push(id)
            });
    });
    
}

const roleArray = []
const roleIDs = []
const allRoles = async () => {
    const theRoles = await connection.query('SELECT * FROM roles', (err, results) => {
            if (err) throw err;
            results.forEach(({ title, id }) => {
                roleArray.push(title)  
                roleIDs.push(id)
            });
    });
    
}

const employees = []
const employeeQuestions = [{
    name: 'firstName',
    message: 'What is their first name? '
},
{
    name: 'lastName',
    message: 'What is their last name? '
},
{
    name: 'role',
    type: 'list',
    message: 'What role are they in? ',
    choices: roleArray   
},
{
    name: 'manager',
    type: 'list',
    message: 'Who is their manager? ',
    choices: managerArray
}
]

function addEmployee () {
    inquirer.prompt(employeeQuestions)
    
    .then((response) => {
        let employeeName = `${response.firstName} ${response.lastName}`
        var roleID = 0
        var managerID = 0
        for (var i = 0; i < managerArray.length; i++){
            if(managerArray[i] === response.manager){
                managerID = managerIDs[i]
            }

        }
        for (var i = 0; i < roleArray.length; i++){
            if(roleArray[i] === response.manager){
                roleID = roleIDs[i]
            }

        }
        connection.query(
            'INSERT INTO employees SET ?',
            {
                    first_name: response.firstName,
                    last_name: response.lastName,
                    role_id: roleID,
                    manager_id: managerID
            })
        console.log(employeeName, 'added into the system')
    })
}



module.exports = { start };