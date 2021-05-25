const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const connection = require('../config/connection');

// --------------------------------------------------------------------------------------------------------------
// placing all employees, departments, managers and roles in arrays for easy access

const employeeArray = []
const allEmployees = async () => {
    employeeArray.splice(0, employeeArray.length)
    const theEmployees = await connection.query('SELECT * FROM employees', (err, results) => {
        if (err) throw err;

            if(results.length !== 0){
                results.forEach(({ id }) => {
                    employeeArray.push(id)
                });
            }
            else{
                employeeArray.push('No Employees Available')
                
            }  
    })
}

const managerArray = []
const managerIDs = []
const allManagers = async () => {
    managerArray.splice(0, managerArray.length)
    managerIDs.splice(0, managerIDs.length)
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
    departmentArray.splice(0, departmentArray.length)
    departmentIDs.splice(0, departmentIDs.length)
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
    roleArray.splice(0, roleArray.length)
    roleIDs.splice(0, roleIDs.length)
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
// --------------------------------------------------------------------------------------------------------------
// question arrays for some inquirer functions 

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



// --------------------------------------------------------------------------------------------------------------
// the initial function passed into the server.js file, includes the above functions to fill the arrays

const start = async () => {
    allManagers()
    allDepartments()
    allRoles()
    allEmployees()
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
            'Update Employee',
            'Delete Data',
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
                updateEmployees();
                break;
            case 'Delete Data':
                deleteFunction()
                break;
            case 'Exit':
                exit();
                break;
        }
        });
};

// same as above but doesnt include the functions to fill the arrays, otherwise the info in the arrays get duplicated each time the menu is returned to

// function home(){
//     inquirer.prompt({
//         name: 'start',
//         type: 'list',
//         message: 'What action would you like to take?',
//         choices: [
//             'View Employees',
//             'View Departments',
//             'View Roles',
//             'Add Employee',
//             'Add Department',
//             'Add Role',
//             'Update Employee',
//             'Delete Data',
//             'Exit',
//         ],
//     })
//     .then((response) => {
//         switch (response.start) {
//             case 'View Employees':
//                 viewEmployees();
//                 break;
//             case 'View Departments':
//                 viewDeparmtents();
//                 break;
//             case 'View Roles':
//                 viewRoles();
//                 break;
//             case 'Add Employee':
//                 addEmployee();
//                 break;
//             case 'Add Department':
//                 addDepartment();
//                 break;
//             case 'Add Role':
//                 addRole();
//                 break;
//             case 'Update Employee':
//                 updateEmployees();
//                 break;
//             case 'Delete Data':
//                 deleteFunction()
//                 break;
//             case 'Exit':
//                 exit();
//                 break;
//         }
//         });
// }

// --------------------------------------------------------------------------------------------------------------
// all view functions

function viewEmployees(){
    inquirer.prompt([
        {
            name: 'choice',
            type: 'list',
            choices: ['View ALL employees', 'View employees by ROLE', 'View employees by MANAGER', 'Exit'],
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
            case 'View employees by MANAGER':
                viewEmployeesByManager()
                break;
            case 'Exit':
                start()
                break;
        }
    })
}

const viewAllEmployees = async () => {
    const allEmployees = await connection.query('SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, managers.manager_name FROM ((employees INNER JOIN roles ON roles.id = employees.role_id) INNER JOIN managers ON managers.id = employees.manager_id) ORDER BY employees.id')
    console.table(
        '===========================================================================',
        '----------------------------   ALL EMPLOYEES   ----------------------------',
        '---------------------------------------------------------------------------',
        allEmployees,
        '==========================================================================='
    )
    viewEmployees()
}

const viewEmployeesByRole = async () => {
    const employeesRole = await connection.query('SELECT roles.title, employees.first_name, employees.last_name, roles.salary FROM employees INNER JOIN roles ON roles.id = employees.role_id ORDER BY roles.id')
    console.table(
        '==========================================',
        '---------   EMPLOYEES BY ROLES   ---------',
        '------------------------------------------',
        employeesRole,
        '=========================================='
    )
    viewEmployees()
}

const viewEmployeesByManager = async () => {
    const employeesManager = await connection.query('SELECT managers.id, managers.manager_name, employees.first_name, employees.last_name FROM employees LEFT JOIN managers on managers.id = employees.manager_id ORDER BY managers.id')
    console.table(
        '==========================================',
        '--------   EMPLOYEES BY MANAGER   --------',
        '------------------------------------------',
        employeesManager,
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
    start()
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
    start()
}

// --------------------------------------------------------------------------------------------------------------
// all add functions

function addEmployee () {
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
            console.table(
                '=============================',
                employeeName,
                '----- ADDED INTO SYSTEM -----',
                '=============================')

            employeeArray.push(employeeName)
        
            start()
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
        console.table(
            '=============================',
            response.department,
            '----- ADDED INTO SYSTEM -----',
            '=============================')
        departmentArray.push(response.department)
        

        start()
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
        console.table(
            '=============================',
            response.title,
            '----- ADDED INTO SYSTEM -----',
            '=============================')
        roleArray.push(response.title)
        start()
    })
}

// --------------------------------------------------------------------------------------------------------------
// all update functions 

function updateEmployees() {
    
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
                updateRole()
                break;
            case 'Update employee MANAGER':
                updateManager()
                break;
        }
        
    })
    
}


const updateRole = async () => {
    const allEmployees = await connection.query('SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, managers.manager_name FROM ((employees INNER JOIN roles ON roles.id = employees.role_id) INNER JOIN managers ON managers.id = employees.manager_id) ORDER BY employees.id')
    console.table(
        '===========================================================================',
        '----------------------------   ALL EMPLOYEES   ----------------------------',
        '---------------------------------------------------------------------------',
        allEmployees,
        '==========================================================================='
    )
    
    inquirer.prompt([{
        name: 'employee',
        type: 'list',
        choices: employeeArray,
        message: 'Please select the employee ID you would like to update'
    },
    {
        name: 'role',
        type: 'list',
        choices: roleArray,
        message: 'What is this employees new role?'
    }
        
    ])
    .then((response) => {
        var newRoleID = 0
        for (let i = 0; i < roleArray.length; i++){
            if (roleArray[i] === response.role){
                newRoleID = roleIDs[i]
            }
        }
        connection.query(
            'UPDATE employees SET ? WHERE ?',
            [
                {
                    role_id: newRoleID
                },
                {
                    id: response.employee
                }
            ]
        )
        console.table(
            '=============================',
            '-------  ROLE UPDATED  ------',
            '=============================')
        
    })
    .then((response) => start())

}

const updateManager = async () => {
    const allEmployees = await connection.query('SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, managers.manager_name FROM ((employees INNER JOIN roles ON roles.id = employees.role_id) INNER JOIN managers ON managers.id = employees.manager_id) ORDER BY employees.id')
    console.table(
        '===========================================================================',
        '----------------------------   ALL EMPLOYEES   ----------------------------',
        '---------------------------------------------------------------------------',
        allEmployees,
        '==========================================================================='
    )

    inquirer.prompt([{
        name: 'employee',
        type: 'list',
        choices: employeeArray,
        message: 'Please select the employee ID you would like to update'
    },
    {
        name: 'manager',
        type: 'list',
        choices: managerArray,
        message: 'What is this employees new manager?'
    }
        
    ])
    .then((response) => {
        var newManagerID = 0
        for (let i = 0; i < managerArray.length; i++){
            if (managerArray[i] === response.manager){
                newManagerID = managerIDs[i]
            }
        }
        connection.query(
            'UPDATE employees SET ? WHERE ?',
            [
                {
                    manager_id: newManagerID
                },
                {
                    id: response.employee
                }
            ]
        )
        console.table(
            '=============================',
            '-----  MANAGER UPDATED  -----',
            '=============================')
        
    })
    .then((response) => start())
}

// --------------------------------------------------------------------------------------------------------------
// all delete functions

function deleteFunction() {
    inquirer.prompt({
        name: 'delete',
        type: 'list',
        choices: ['Delete an EMPLOYEE', 'Delete a DEPARTMENT', 'Delete a ROLE', 'Exit'],
        message: 'What would you like to do?'
    })
    .then((response) => {
        switch(response.delete){
            case 'Delete an EMPLOYEE':
                deleteEmployee()
                break;
            case 'Delete a DEPARTMENT':
                deleteDepartment()
                break;
            case 'Delete a ROLE':
                deleteRole()
                break;
            case 'Exit':
                start()
                break;

        }
    })
}

const deleteEmployee = async () => {
    const allEmployees = await connection.query('SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, managers.manager_name FROM ((employees INNER JOIN roles ON roles.id = employees.role_id) INNER JOIN managers ON managers.id = employees.manager_id) ORDER BY employees.id')
    console.table(
        '===========================================================================',
        '----------------------------   ALL EMPLOYEES   ----------------------------',
        '---------------------------------------------------------------------------',
        allEmployees,
        '==========================================================================='
    )
    inquirer.prompt({
        name: 'employee',
        type: 'list',
        choices: employeeArray,
        message: 'Please select the employee ID you would like to delete'
    })
    .then((response) => {
        connection.query('DELETE FROM employees WHERE ?', {
            id: response.employee
        })
        console.table(
            '=============================',
            '-----  EMPLOYEE DELETED  ----',
            '=============================')
    })
    .then((response) => start())
}

const deleteDepartment = async () => {
    const departments = await connection.query('SELECT * FROM departments')
    console.table(
        '===================================',
        '---------   DEPARTMENTS   ---------',
        '-----------------------------------',
        departments,
        '==================================='
    )
    inquirer.prompt({
        name: 'department',
        type: 'list',
        choices: departmentArray,
        message: 'Please select the department you wish to delete'
    })
    .then((response) => {
        connection.query('DELETE FROM departments WHERE ?', {
            department_name: response.department
        })
        console.table(
            '=============================',
            '----  DEPARTMENT DELETED  ---',
            '=============================')
    })
    .then((response) => start())
}

const deleteRole = async () => {
    const roles = await connection.query('SELECT * FROM roles')
    console.table(
        '===================================',
        '------------   ROLES   ------------',
        '-----------------------------------',
        roles,
        '==================================='
    )
    inquirer.prompt({
        name: 'role',
        type: 'list',
        choices: roleArray,
        message: 'Please select a role you would like to delete'
    })
    .then((response) => {
        connection.query('DELETE FROM roles WHERE ?', {
            title: response.role
        })
        console.table(
            '=============================',
            '-------  ROLE DELETED  ------',
            '=============================')
    })
    .then((response) => start())
}


// --------------------------------------------------------------------------------------------------------------
// exit function

function exit() {
    console.table(
        '=============================',
        '-------  LOGGING OFF  -------',
        '=============================')
    process.exit()
}


module.exports = { start };