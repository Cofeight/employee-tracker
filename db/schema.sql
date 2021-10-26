--deletes any pre-existing database by that name
--creates new database by that name
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

--selects database as active
USE employee_db;

--department table parameters
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

--role table parameters
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

--employee table parameters
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

--NOTES

--I found it significantly easier to run this through mySQL Workbench
--Copy & Paste from Schema/Seeds files
--Run them through line by line during inital creating and populating
--Once all tables created and populated
--Rinse & repeat as needed to reset data tables

--CHALLENGES

--I strugged with the join command for the employee table
--Found success with tutor after defining all columns to include
--Resolved any potential syntax errors
