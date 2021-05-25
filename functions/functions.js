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
                viewEmployees();
                break;
            case 'View Departments':
                viewDeparmtents();
                break;
            case 'View Roles':
                viewRoles();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Update Employee':
                console.log("Update Employee Role");
                break;
            case 'Exit':
                // exitProgram();
                break;
        }
        });
};

function home(){
    inquirer.prompt({
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
                viewEmployees();
                break;
            case 'View Departments':
                viewDeparmtents();
                break;
            case 'View Roles':
                viewRoles();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Update Employee Role':
                console.log("Update Employee Role");
                break;
            case 'Exit':
                // exitProgram();
                break;
        }
        });
}

const managerArray = []
const managerIDs = []
const allManagers = async () => {
    const theManagers = await connection.query('SELECT * FROM managers', (err, results) => {
            if (err) throw err;

            if(results.length !== 0){
                results.forEach(({ manager_name, id }) => {
                    managerArray.push(manager_name)
                    managerIDs.push(id)
                });
            }
            else{
                managerArray.push('No Managers Available')
                managerIDs.push(0)
            }    
    });  
}

const departmentArray = []
const departmentIDs = []
const allDepartments = async () => {
    const theDepartments = await connection.query('SELECT * FROM departments', (err, results) => {
            if (err) throw err;

            if(results.length !== 0){
                results.forEach(({ department_name, id }) => {
                    departmentArray.push(department_name)
                    departmentIDs.push(id)
                });
            }
            else{
                departmentArray.push('No Departments Available')
                departmentIDs.push(0)
            }
    }); 
}

const roleArray = []
const roleIDs = []
const allRoles = async () => {
    const theRoles = await connection.query('SELECT * FROM roles', (err, results) => {
            if (err) throw err;
            if(results.length !== 0){
                results.forEach(({ title, id }) => {
                    roleArray.push(title)  
                    roleIDs.push(id)
                });
            }
            else{
                roleArray.push('No Roles Available')
                roleIDs.push(0)
            }
    }); 
}

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
}]

const roleQuestions = [{
    name: 'title',
    message: 'What is the title of the position you would like to add? '
},
{
    name: 'salary',
    message: 'What is the salary for this position? '
},
{
    name: 'department',
    type: 'list',
    message: 'What department will the position be in? ',
    choices: departmentArray
}]

function addEmployee () {
    console.log(roleIDs)
    inquirer.prompt(employeeQuestions)
    
    .then((response) => {
        let employeeName = `${response.firstName} ${response.lastName}`
        var roleID = 0
        var managerID = 0
        if (managerArray.length !== 0){
            for (var i = 0; i < managerArray.length; i++){
                if(managerArray[i] === response.manager){
                    managerID = managerIDs[i]
                }
    
            }
            
        }

        if (roleArray.length !== 0){
            for (var i = 0; i < roleArray.length; i++){
                if(roleArray[i] === response.role){
                    roleID = roleIDs[i]
                    console.log(roleID)
                }
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
        home()
    })
}

function addDepartment() {
    inquirer.prompt({
        name: 'department',
        message: 'What is the name of the department you would like to add?'
    })
    .then((response) => {
        connection.query(
            'INSERT INTO departments SET ?',
            {
                department_name: response.department
            }
        )
        console.log(response.department, 'added into the system')
        departmentArray.push(response.department)
        home()
    })
}



function addRole() {
    inquirer.prompt(roleQuestions)
    .then((response) => {
        var departmentID = 0

        if (departmentArray.length !== 0){
            for (var i = 0; i < departmentArray.length; i++){
                if (departmentArray[i] === response.department){
                    departmentID = departmentIDs[i]
                }
            }
        }

        connection.query(
            'INSERT INTO roles SET ?',
            {
                title: response.title,
                salary: response.salary,
                department_id: departmentID
            }
        )
        console.log(response.title, 'added into the system')
        roleArray.push(response.title)
        home()
    })
}

function viewEmployees(){
    inquirer.prompt([
        {
            name: 'choice',
            type: 'list',
            choices: ['View ALL employees', 'View employees by ROLE', 'Exit'],
            message: 'What would you like to do?'
        }
    ])
    .then((response) => {
        switch (response.choice) {
            case 'View ALL employees':
                viewAllEmployees()
                break;
            case 'View employees by ROLE':
                viewEmployeesByRole()
                break;
            case 'Exit':
                home()
                break;
        }
    })
}

const viewAllEmployees = async () => {
    const allEmployees = await connection.query('SELECT employees.first_name, employees.last_name, roles.title, roles.salary, managers.manager_name FROM ((employees INNER JOIN roles ON roles.id = employees.role_id) INNER JOIN managers ON managers.id = employees.manager_id)')
    console.table(
        '=====================================================',
        '-----------------   ALL EMPLOYEES   -----------------',
        '-----------------------------------------------------',
        allEmployees,
        '====================================================='
    )
    viewEmployees()
}

const viewEmployeesByRole = async () => {
    const employeesRole = await connection.query('SELECT roles.title, employees.first_name, employees.last_name, roles.salary FROM employees LEFT JOIN roles ON roles.id = employees.role_id')
    console.table(
        '==========================================',
        '---------   EMPLOYEES BY ROLES   ---------',
        '------------------------------------------',
        employeesRole,
        '=========================================='
    )
    viewEmployees()
}

const viewDeparmtents = async () => {
    const departments = await connection.query('SELECT * FROM departments')
    console.table(
        '===================================',
        '---------   DEPARTMENTS   ---------',
        '-----------------------------------',
        departments,
        '==================================='
    )
    home()
}

const viewRoles = async () => {
    const roles = await connection.query('SELECT * FROM roles')
    console.table(
        '===================================',
        '------------   ROLES   ------------',
        '-----------------------------------',
        roles,
        '==================================='
    )
    home()
}

const updateEmployees = async () => {
    inquirer.prompt([{
        name: 'choice',
        type: 'list',
        choices: ['Update employee ROLE', 'Update employee MANAGER'],
        message: 'What would you like to do?'
    }
    ])
    .then((response) => {
        switch(response.choice) {
            case 'Update employee ROLE':
                // something
                break;
            case 'Update employee MANAGER':
                // something
                break;
        }
    })
}

const updateRole = async () => {
    
}



module.exports = { start };