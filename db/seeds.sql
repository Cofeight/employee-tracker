INSERT INTO department (name)
VALUES
('Sales / Marketing'),
('IT'),
('Operations'),
('Payroll / Accounting');

INSERT INTO role (title, salary, department_id)
VALUES
('Marketing Director', 95000, 1),
('Senior Developer', 80000, 2),
('Project Manager', 75000, 3),
('Chief Financial Officer', 100000, 4),
('Payroll Coordinator', 65000, 4),
('Sales Associate', 55000, 1),
('Project Lead', 60000, 3),
('Junior Developer', 70000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Robert', 'Diggs', 1, null),
('Gary', 'Grice', 2, null),
('Jason', 'Hunter', 3, null),
('Lamont', 'Hawkins', 4, null),
('Clifford', 'Smith', 5, 1),
('Corey', 'Woods', 6, 2),
('Elgin', 'Turner', 7, 3),
('Darryl', 'Hill', 8, 4);