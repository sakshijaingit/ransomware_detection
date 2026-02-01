CREATE TABLE customers (
    id INT,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(15),
    balance DECIMAL(10,2)
);

INSERT INTO customers VALUES
(1, 'Rahul Sharma', 'rahul@gmail.com', '9876543210', 45890.50),
(2, 'Anita Verma', 'anita@gmail.com', '9123456789', 78900.00),
(3, 'Mohit Jain', 'mohit@gmail.com', '9988776655', 123450.75),
(4, 'Pooja Singh', 'pooja@gmail.com', '9001122334', 56000.00);

CREATE TABLE bank_customers (
    customer_id INT PRIMARY KEY,
    full_name VARCHAR(100),
    dob DATE,
    gender VARCHAR(10),
    mobile VARCHAR(15),
    email VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    customer_type VARCHAR(20),
    created_on DATE
);

INSERT INTO bank_customers VALUES
(101, 'Rahul Sharma', '1994-05-14', 'Male', '98XXXX3210', 'rahul@gmail.com', 'Delhi', 'Delhi', 'Retail', '2018-03-21'),
(102, 'Neha Verma', '1992-09-20', 'Female', '91XXXX5678', 'neha@gmail.com', 'Panipat', 'Haryana', 'Retail', '2019-07-10'),
(103, 'Aman Gupta', '1988-12-02', 'Male', '99XXXX7788', 'aman@gmail.com', 'Noida', 'UP', 'Corporate', '2017-11-01');
ENCRYPTED_DATA
ENCRYPTED_DATA
ENCRYPTED_DATA
ENCRYPTED_DATA
ENCRYPTED_DATA
ENCRYPTED_DATA
ENCRYPTED_DATA
ENCRYPTED_DATA
ENCRYPTED_DATA
ENCRYPTED_DATA
