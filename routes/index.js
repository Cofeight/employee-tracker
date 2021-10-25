const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const util = require('util');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'password',
    database: 'employee_db'
});

connection.query = util.promisify(connection.query);

connection.connect(err => {
    if (err) throw err;
    firstAction();
});


console.table(
    "\n~~~~~~~~~~~EMPLOYEE TRACKER 9000~~~~~~~~~~~~~~\n"
)

const firstAction = async () => {
    try {
        let answer = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'Please choose from the following options: ',
            choices: [
                "View all Roles",
                "View all Employees",
                "View all Departments",
                "Add a Role",
                "Add an Employee",
                "Add a Department",
                "Update an Employee Role",
                "Exit"
            ]
        });

        switch (answer.action) {
            case 'View all Roles':
                roleView();
                break;
            
            case 'View all Employees':
                employeeView();
                break;

            case 'View all Departments':
                departmentView();
                break;

            case 'Add a Role':
                roleAdd();
                break;

            case 'Add Employees':
                employeeAdd();
                break;

            case 'Add Departments':
                departmentAdd();
                break;

            case 'Update an Employee Role':
                employeeUpdate();
                break;
        };
    } catch(err) {
        console.log(err);
        firstAction();
    };
}

const departmentView = async () => {
    console.log('Department View');
    try {
        let query = 'SELECT * FROM department';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let departmentArray = [];
            res.forEach(department => departmentArray.push(department));
            console.table(departmentArray);
            firstAction();
        });
    } catch (err) {
        console.log(err);
        firstAction();
    };
}

const roleView = async () => {
    try {
        console.log('Role View');

        let query = 'SELECT * FROM role';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let roleArray = [];
            res.forEach(role => roleArray.push(role));
            console.table(roleArray);
            firstAction();
        });
    } catch (err) {
        console.log(err);
        firstAction();
    };
}

const employeeView = async () => {
    console.log('Employee View');
    try {
        let query = 'SELECT * FROM employee';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let employeeArray = [];
            res.forEach(employee => employeeArray.push(employee));
            console.table(employeeArray);
            firstAction();
        });
    } catch (err) {
        console.log(err);
        firstAction();
    };
}

const departmentAdd = async () => {
    try {
        console.log('Department Add');

        let answer = await inquirer.prompt([
            {
                name: 'deptName',
                type: 'input',
                message: 'Name of the new department?'
            }
        ]);

        let result = await connection.query("INSERT INTO department SET ?", {
            department_name: answer.deptName
        });

        console.log(`${answer.deptName} has been added successfully to departments.\n`)
        firstAction();

    } catch (err) {
        console.log(err);
        firstAction();
    };
}

const roleAdd = async () => {
    try {
        console.log('Role Add');

        let departments = await connection.query("SELECT * FROM department");

        let answer = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the title of this new role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What salary does this role pay?'
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
                message: 'What department ID is this role associated with?',
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
        firstAction();

    } catch (err) {
        console.log(err);
        firstAction();
    };
}

const employeeAdd = async () => {
    try {
        console.log('Employee Add');

        let roles = await connection.query("SELECT * FROM role");

        let managers = await connection.query("SELECT * FROM employee");

        let answer = await inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'First name of this Employee?'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'Last name of this Employee?'
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
                message: "ID role of this employee?",
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
                message: "ID of this employee's manager?"
            }
        ])

        let result = await connection.query("INSERT INTO employee SET ?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: (answer.employeeRoleId),
            manager_id: (answer.employeeManagerId)
        });

        console.log(`${answer.firstName} ${answer.lastName} has been added successfully.\n`);
        firstAction();

    } catch (err) {
        console.log(err);
        firstAction();
    };
}

const employeeUpdate = async () => {
    try {
        console.log('Employee Update');
        
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
                message: 'Please choose an employee to update.'
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
                message: 'Please select the role to update the employee with.'
            }
        ]);

        let result = await connection.query("UPDATE employee SET ? WHERE ?", [{ role_id: roleSelection.role }, { id: employeeSelection.employee }]);

        console.log(`The role was successfully updated.\n`);
        firstAction();

    } catch (err) {
        console.log(err);
        firstAction();
    };
}