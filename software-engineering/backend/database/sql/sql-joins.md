# SQL Joins

**SQL joins** are used to combine rows from two or more tables based on related columns. They are essential for querying relational databases efficiently and retrieving meaningful data spread across multiple tables[^1] [^2] [^4] [^5].

### Main Types of SQL Joins

| Join Type | Description |
| :-- | :-- |
| **INNER JOIN** | Returns only rows where there is a match in both tables based on the join condition. |
| **LEFT JOIN** | Returns all rows from the left table, and matched rows from the right table; unmatched right table columns will be NULL. |
| **RIGHT JOIN** | Returns all rows from the right table, and matched rows from the left table; unmatched left table columns will be NULL. |
| **FULL JOIN** | Returns all rows when there is a match in either left or right table; unmatched columns from either side will be NULL. |
| **CROSS JOIN** | Returns the Cartesian product of both tables (every combination of rows). |
| **SELF JOIN** | Joins a table to itself, useful for hierarchical or recursive data structures. |

### Examples

**INNER JOIN:**

```sql
SELECT a.id, a.name, b.salary
FROM employees a
INNER JOIN salaries b
ON a.id = b.employee_id;
```

*Returns only employees who have a salary record in the salaries table.*

**LEFT JOIN:**

```sql
SELECT a.id, a.name, b.salary
FROM employees a
LEFT JOIN salaries b
ON a.id = b.employee_id;
```

*Returns all employees, and their salary if available; otherwise, salary is NULL.*

**RIGHT JOIN:**

```sql
SELECT a.id, a.name, b.salary
FROM employees a
RIGHT JOIN salaries b
ON a.id = b.employee_id;
```

*Returns all salary records, and employee info if available; otherwise, employee info is NULL.*

**FULL JOIN:**

```sql
SELECT a.id, a.name, b.salary
FROM employees a
FULL JOIN salaries b
ON a.id = b.employee_id;
```

*Returns all employees and all salary records, matching where possible; unmatched columns are NULL.*

**Summary:**

- Use **INNER JOIN** for only matching rows.
- Use **LEFT/RIGHT/FULL JOIN** to include unmatched rows from one or both tables.
- Use **CROSS JOIN** for all possible row combinations.
- Use **SELF JOIN** for relationships within the same table[^1] [^2] [^4] [^5].

[^1]: https://www.tutorialspoint.com/sql/sql-using-joins.htm

[^2]: https://www.geeksforgeeks.org/sql/sql-join-set-1-inner-left-right-and-full-joins/

[^3]: https://www.secoda.co/learn/sql-joins-a-comprehensive-guide

[^4]: https://www.w3schools.com/sql/sql_join.asp

[^5]: https://www.programiz.com/sql/join

[^6]: https://www.atlassian.com/data/sql/sql-join-types-explained-visually

[^7]: https://www.youtube.com/watch?v=0OQJDd3QqQM

[^8]: https://www.devart.com/dbforge/sql/sqlcomplete/sql-join-statements.html

[^9]: https://www.datacamp.com/cheat-sheet/sql-joins-cheat-sheet

