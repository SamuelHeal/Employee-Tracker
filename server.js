const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require('util');
const logo = require('asciiart-logo');
const connection = require('./connection.js');
const { start } = require('./functions');

connection.query = util.promisify(connection.query);

connection.connect((err) => {
    if (err) {
        console.log(`Error connecting ${err.stack}`);
        return;
    }
    initialise();
});

initialise = () => {
    console.log(
        logo({
            name: 'EMPLOYEE MANAGER',
            lineChars: 10,
            padding: 3,
            margin: 1,
            borderColor: 'bold-yellow',
            logoColor: 'bold-white',
            textColor: 'white',
        })
            .render()
    );
    start();
}