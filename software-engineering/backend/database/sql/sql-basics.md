# SQL Basics

Here is a set of essential SQL questions and answers, formatted for Markdown files. Each question is followed by a concise answer and, where relevant, an example query.

## What is SQL?

SQL (Structured Query Language) is a standard language used to communicate with relational databases. It is used for querying, updating, and managing data.

### What is the difference between a primary key and a foreign key?

- **Primary Key:** Uniquely identifies each record in a table. Cannot be NULL or duplicated.
- **Foreign Key:** A field in one table that refers to the primary key in another table, establishing a relationship between the two tables.


### Write a SQL query to retrieve all records from a table named `Employees`.

```sql
SELECT * FROM Employees;
```

### How do you create a new table in SQL? Provide an example.

```sql
CREATE TABLE Employees (
  EmployeeID INT PRIMARY KEY,
  Name VARCHAR(100),
  Department VARCHAR(50)
);
```


### What is normalization? Explain its types.

Normalization is the process of organizing data to reduce redundancy and improve data integrity.
Common types:

- **1NF (First Normal Form):** Eliminate repeating groups.
- **2NF (Second Normal Form):** Remove partial dependencies.
- **3NF (Third Normal Form):** Remove transitive dependencies.


### Write a SQL query to find the second highest salary from a `Salaries` table.

```sql
SELECT MAX(Salary) AS SecondHighest
FROM Salaries
WHERE Salary < (SELECT MAX(Salary) FROM Salaries);
```


### What are stored procedures? How do you create one?

A stored procedure is a precompiled collection of SQL statements that can be executed as a single unit.

```sql
CREATE PROCEDURE GetAllEmployees
AS
SELECT * FROM Employees;
```


### Write a SQL query to join two tables, `Orders` and `Customers`, on the `CustomerID` field.

```sql
SELECT *
FROM Orders
INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;
```


### Explain the concept of indexing in SQL. Why is it important?

Indexing is a database optimization technique that creates a data structure on columns to speed up data retrieval. Indexes improve query performance and reduce database load.

### Write a SQL query to count the number of employees in each department from the `Employees` table.

```sql
SELECT Department, COUNT(*) AS EmployeeCount
FROM Employees
GROUP BY Department;
```


### What is a view in SQL? How do you create one?

A view is a virtual table based on the result of a SELECT query.
Example:

```sql
CREATE VIEW ActiveEmployees AS
SELECT * FROM Employees WHERE Status = 'Active';
```


### Write a SQL query to update the email address of an employee with a specific ID.

```sql
UPDATE Employees
SET Email = 'new.email@example.com'
WHERE EmployeeID = 123;
```


### Explain the difference between clustered and non-clustered indexes.

- **Clustered Index:** Determines the physical order of data in a table. Only one per table.
- **Non-Clustered Index:** A separate structure that points to the data. Multiple allowed per table.


### Write a SQL query to delete records from a table named `Products` where the `Stock` is zero.

```sql
DELETE FROM Products
WHERE Stock = 0;
```


### What are transactions in SQL? Explain ACID properties.

A transaction is a sequence of operations performed as a single logical unit of work.
**ACID properties:**

- **Atomicity:** All operations succeed or none do.
- **Consistency:** Maintains database integrity.
- **Isolation:** Transactions do not interfere with each other.
- **Durability:** Changes persist even after a system failure.


### Write a SQL query to find all employees who joined in the last 30 days.

```sql
SELECT *
FROM Employees
WHERE DATEDIFF(day, JoinDate, GETDATE()) <= 30;
```


### What is a trigger in SQL? Provide an example.

A trigger is a special procedure that automatically executes in response to certain events on a table.

```sql
CREATE TRIGGER trg_AfterInsert
ON Employees
AFTER INSERT
AS
BEGIN
  INSERT INTO AuditLog (ChangeType, ChangeDate)
  VALUES ('Insert', GETDATE());
END;
```


### Explain the difference between INNER JOIN and LEFT JOIN with examples.

- **INNER JOIN:** Returns only matching rows from both tables.

```sql
SELECT * FROM A INNER JOIN B ON A.id = B.id;
```

- **LEFT JOIN:** Returns all rows from the left table, and matching rows from the right table (NULL if no match).

```sql
SELECT * FROM A LEFT JOIN B ON A.id = B.id;
```


### Explain the difference between UNION and UNION ALL.

- **UNION:** Combines results from two queries and removes duplicates.
- **UNION ALL:** Combines results and includes all duplicates.


### What are Common Table Expressions (CTEs)? Provide an example.

A CTE is a temporary named result set defined within a query for improved readability and modularity.

```sql
WITH RecentEmployees AS (
  SELECT * FROM Employees WHERE JoinDate > '2025-01-01'
)
SELECT * FROM RecentEmployees WHERE Department = 'Sales';
```


### What is the GROUP BY clause? Provide an example.

`GROUP BY` groups rows that have the same values in specified columns, often used with aggregate functions.

```sql
SELECT Department, AVG(Salary) AS AvgSalary
FROM Employees
GROUP BY Department;
```


### What is a recursive query in SQL?

A recursive query repeatedly references itself to process hierarchical or tree-structured data, often using a recursive CTE.

```sql
WITH RecursiveCTE (ID, ParentID) AS (
  SELECT ID, ParentID FROM Categories WHERE ParentID IS NULL
  UNION ALL
  SELECT c.ID, c.ParentID FROM Categories c
  INNER JOIN RecursiveCTE r ON c.ParentID = r.ID
)
SELECT * FROM RecursiveCTE;
```


### What is the purpose of the SQL PIVOT operator?

The PIVOT operator transforms rows into columns, making it easier to summarize or rearrange data for reporting.

### What are the differences between transactional and analytical queries?

- **Transactional queries:** Focus on day-to-day operations (insert, update, delete), optimized for speed and integrity.
- **Analytical queries:** Involve complex aggregations and analysis, optimized for insights from large datasets.


### How do you ensure data consistency across distributed databases?

- Use distributed transactions (e.g., two-phase commit).
- Implement eventual consistency if strong consistency isn’t required.
- Use conflict resolution mechanisms and reliable data replication.

[^1]: https://www.datacamp.com/blog/top-sql-interview-questions-and-answers-for-beginners-and-intermediate-practitioners

[^2]: https://www.finalroundai.com/blog/sql-server-interview-questions

[^3]: https://upesonline.ac.in/blog/advanced-sql-interview-questions

[^4]: https://www.geeksforgeeks.org/sql/sql-interview-questions/

[^5]: https://www.reddit.com/r/SQL/comments/191lesk/interview_questions_for_sql/

[^6]: https://www.toptal.com/sql/interview-questions

[^7]: https://datalemur.com/blog/advanced-sql-interview-questions

[^8]: https://roadmap.sh/questions/sql

[^9]: https://www.interviewbit.com/sql-interview-questions/

[^10]: https://www.youtube.com/watch?v=izlf02YaQ_4

