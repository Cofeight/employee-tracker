//Established required packages
    //Mysql for server connection and performing queries
    //Inquirer for CL inquiry/user interaction
    //cTable for printing Mysql rows in the console
    //Util for .promisify function
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const util = require('util');

//creates server connection with predefined routes
//TODO: REFACTORING ~~~ Look into username/password encryption
//Use .env file for associating a key,value with login information (npm i dotenv; DB_())
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'password',
    database: 'employee_db'
});

//establishes a callback with promisify for server connection
connection.query = util.promisify(connection.query);

//Upon confirmation of mysql server connection,
    //Initiates startTracker async function
connection.connect(err => {
    if (err) throw err;
    startTracker();
});

//displays "LOGO" of CL application via the cTable package
//TODO: REFACTORING ~~~ look into ascii-art to provide more styiling within the CLI

console.table(            
    "/////////////////////////////////////////////////",      
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "              EMPLOYEE TRACKER 9000              ",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "/////////////////////////////////////////////////",
)

//Defines startTracker async/await function
    //Uses try statement
        //Initiaties via inquirer.prompt
            //Presents user with scrollable choices
        //Uses switch cases to cycle through user choices via Inquirer
    //Uses catch statement for any error
    //Logs any error
//Initiates startTracker async/await function

const startTracker = async () => {
    try {
        let answer = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'Please choose from the following options: ',
            choices: ["View all Departments","View all Roles","View all Employees","Add a Department","Add a Role","Add an Employee","Update an Employee Role"]
        });

        switch (answer.action) {
            
            case 'View all Departments':
                viewAllDepartments();
                break;

            case 'View all Roles':
                viewAllRoles();
                break;
            
            case 'View all Employees':
                viewAllEmployees();
                break;
             
            case 'Add a Department':
                addADepartment();
                break;

            case 'Add a Role':
                addARole();
                break;

            case 'Add an Employee':
                addAnEmployee();
                break;

            case 'Update an Employee Role':
                updateEmployeeRole();
                break;                 
        };
    } catch(err) {
        console.log(err);
        startTracker();
    };
}

const viewAllDepartments = async () => {
    console.log('Viewing All Departments');
    try {
        let query = 'SELECT * FROM department';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let departmentArray = [];
            res.forEach(department => departmentArray.push(department));
            console.table(departmentArray);
            startTracker();
        });
    } catch (err) {
        console.log(err);
        startTracker();
    };
}

const viewAllRoles = async () => {
    try {
        console.log('Viewing All Roles');

        let query = 'SELECT * FROM role';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let roleArray = [];
            res.forEach(role => roleArray.push(role));
            console.table(roleArray);
            startTracker();
        });
    } catch (err) {
        console.log(err);
        startTracker();
    };
}

const viewAllEmployees = async () => {
    console.log('Viewing All Employees');
    try {
        let query = 'SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.salary, role.department_id FROM employee left JOIN role ON employee.role_id = role.id';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let employeeArray = [];
            res.forEach(employee => employeeArray.push(employee));
            console.table(employeeArray);
            startTracker();
        });
    } catch (err) {
        console.log(err);
        startTracker();
    };
}

const addADepartment = async () => {
    try {
        console.log('Adding A Department');
        inquirer.prompt([
            {
                name: 'deptName',
                type: 'input',
                message: 'Name of the new department?'
            }
        ]).then(answer => {
            connection.query("INSERT INTO department SET ?", {
                name: answer.deptName
            });
            console.log(`${answer.deptName} has been added successfully to departments.\n`)
            startTracker();
        })
    } catch (err) {
        console.log(err);
        startTracker();
    };
}

const addARole = async () => {
    try {
        console.log('Adding A Role');
        let departments = await connection.query("SELECT * FROM department");
        let answer = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the title of this new role? '
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this new role? '
            },
            {
                name: 'departmentId',
                type: 'list',
                choices: departments.map((departmentId) => {
                    return {
                        name: departmentId.department_name,
                        value: departmentId.id
                    }
                }),
                message: 'What is the department ID of this new role? ',
            }
        ]);
        let chosenDepartment;
        for (i = 0; i < departments.length; i++) {
            if(departments[i].department_id === answer.choice) {
                chosenDepartment = departments[i];
            };
        }
        let result = await connection.query("INSERT INTO role SET ?", {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.departmentId
        })
        console.log(`${answer.title} role has been added successfully.\n`)
        startTracker();
    } catch (err) {
        console.log(err);
        startTracker();
    };
}

const addAnEmployee = async () => {
    try {
        console.log('Adding An Employee');
        let roles = await connection.query("SELECT * FROM role");
        let managers = await connection.query("SELECT * FROM employee");
        let answer = await inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: "What is the employee's first name? "
            },
            {
                name: 'lastName',
                type: 'input',
                message: "What is the employee's last name? "
            },
            {
                name: 'employeeRoleId',
                type: 'list',
                choices: roles.map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    }
                }),
                message: "What is the employee's Role ID? ",
            },
            {
                name: 'employeeManagerId',
                type: 'list',
                choices: managers.map((manager) => {
                    return {
                        name: manager.first_name + " " + manager.last_name,
                        value: manager.id
                    }
                }),
                message: "What is the ID of this employee's manager? "
            }
        ])

        let result = await connection.query("INSERT INTO employee SET ?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: (answer.employeeRoleId),
            manager_id: (answer.employeeManagerId)
        });

        console.log(`${answer.firstName} ${answer.lastName} has been added successfully.\n`);
        startTracker();

    } catch (err) {
        console.log(err);
        startTracker();
    };
}

const updateEmployeeRole = async () => {
    try {
        console.log('Updating Employee Role');
        let employees = await connection.query("SELECT * FROM employee");
        let employeeSelection = await inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                choices: employees.map((employeeName) => {
                    return {
                        name: employeeName.first_name + " " + employeeName.last_name,
                        value: employeeName.id
                    }
                }),
                message: 'Please choose an employee to update. '
            }
        ]);

        let roles = await connection.query("SELECT * FROM role");
        let roleSelection = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: roles.map((roleName) => {
                    return {
                        name: roleName.title,
                        value: roleName.id
                    }
                }),
                message: 'Please select the role to update the employee with. '
            }
        ]);
        let result = await connection.query("UPDATE employee SET ? WHERE ?", [{ role_id: roleSelection.role }, { id: employeeSelection.employee }]);
        console.log(`The role was successfully updated.\n`);
        startTracker();
    } catch (err) {
        console.log(err);
        startTracker();
    };
}