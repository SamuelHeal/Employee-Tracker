const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const connection = require('../config/connection');


const start = async () => {
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
    })
        .then((response) => {
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
                case 'Add Employees':
                    // viewDepartments();
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



module.exports = { start };