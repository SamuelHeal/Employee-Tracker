USE employee_DB;

INSERT INTO departments (department_name)
VALUES ("IT"), 
("Sales"), 
("Marketing"), 
("Finance"), 
("HR"), 
("Business"),
("Executive");

INSERT INTO roles (title, salary, department_id)
VALUES ("Salesperson", 45000.00, 2),
("Accounts Manager", 65000.00, 4),
("Marketing Analyst", 55000.00, 3),
("Business Analyst", 75000.00, 6),
("Software Developer", 90000.00, 1),
("Senior Software Engineer", 120000.00, 1),
("Accountant", 80000.00, 4),
("HR Manager", 55000.00, 5),
("Director", 180000.00, 7);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("David", "Beckem", 6, 1),
("Stephen", "Curry", 6, 1),
("Lebron", "James", 3, 4),
("Leondardo", "Dicaprio", 4, 1),
("Jennifer", "Anniston", 5, 2),
("Margot", "Robbie", 7, 1),
("David", "Gilmore", 2, 1),
("John", "Mayor", 1, 7),
("Stevie", "Wonder", 1, 7),
("Business", "Man", 8, 11),
("Rick", "Morty", 9, 1);

INSERT INTO managers (manager_name)
VALUES ("Joey Tribbiani"),
("Bill Murray"),
("Natalie Portman");