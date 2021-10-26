//TEST FILE - BONUS


//line 58 index.js/choices: "Delete a Department","Delete a Role","Delete an Employee"

//line 90 index.js./switch:            
//            
//            case 'Delete a Department':
//                deleteDepartment();
//                break;
//                
//            case 'Delete a Role':
//                deleteRole();
//                break;
//                            
//            case 'Delete an Employee':
//                deleteEmployee();
//                break;
//         


//end of index.js DELETE section:

//const deleteDepartment = async () => {
//    try {
//        console.log('Viewing Departments for Deletion');
//        let departments = await connection.query("SELECT * FROM department");
//        let answer = await inquirer.prompt(
//            {
//                name: 'deleteDepartment',
//                type: 'list',
//                message: 'What Department do you want to delete?',
//                choices: departments.map((departmentId) => {
//                    return {
//                        name: departmentId.department_name,
//                        value: departmentId.id
//                    }
//                }),
//        }).then(answer => {
//            connection.query(`DELETE FROM department WHERE ? `, { name: answer.deleteDepartment });
//            console.log(`Department ${answer.deleteDepartment} has been deleted successfully.\n`)
//            startTracker();
//        })
//    } catch (err) {
//        console.log(err);
//        startTracker();
//    };
//}
//