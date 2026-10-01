# primary key and foregin key

A **primary key** and a **foreign key** are both essential concepts in relational databases, but they serve different purposes:

### Primary Key

- **Unique Identifier:** A primary key uniquely identifies each record in a table. No two rows can have the same primary key value[^1] [^2] [^3].
- **No NULLs or Duplicates:** Primary key columns cannot have NULL values or duplicates[^1] [^2] [^3].
- **One per Table:** Each table can have only one primary key, though it can consist of one or multiple columns (composite key)[^1] [^2].
- **Example:** In an `Employee` table, `Emp_Id` might be the primary key, ensuring each employee has a unique ID[^1].


### Foreign Key

- **Table Relationship:** A foreign key is a column (or set of columns) in one table that refers to the primary key in another table, creating a link between the two tables[^1] [^2] [^3].
- **Referential Integrity:** It ensures that the value in the foreign key column matches a value in the referenced primary key column, maintaining data consistency and integrity[^2] [^3].
- **Can Be NULL or Duplicate:** Foreign key columns can contain NULLs (if the relationship is optional) and can have duplicate values (if multiple rows reference the same record in the other table)[^1].
- **Multiple per Table:** A table can have more than one foreign key[^1].
- **Example:** In an `Orders` table, `CustomerID` might be a foreign key referencing the `CustomerID` primary key in a `Customers` table[^2] [^3].


### Summary Table

| Feature | Primary Key | Foreign Key |
| :-- | :-- | :-- |
| Purpose | Uniquely identifies each record | Links two tables together |
| Uniqueness | Must be unique | Can be duplicated |
| NULLs Allowed | Not allowed | Allowed |
| Count per Table | Only one | Multiple allowed |
| Relationship | Defines uniqueness in its own table | References primary key in another table |

**In short:**

- **Primary key:** Uniquely identifies a row within its own table.
- **Foreign key:** References a primary key in another table to establish a relationship and maintain referential integrity[^1] [^2][^3].

[^1]: https://www.scholarhat.com/tutorial/sqlserver/difference-between-primary-key-and-foreign-key

[^2]: https://www.pingcap.com/article/primary-key-vs-foreign-key-unlocking-efficient-data-management-in-databases/

[^3]: https://www.cockroachlabs.com/blog/what-is-a-foreign-key/

[^4]: https://www.reddit.com/r/AskComputerScience/comments/lfmkpi/can_someone_explain_foreign_and_primary_keys_in/

[^5]: https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints?view=sql-server-ver17

[^6]: https://www.astera.com/type/blog/primary-key-vs-foreign-key/

[^7]: https://www.youtube.com/watch?v=2SYyb6gNpfg

[^8]: https://www.w3schools.com/sql/sql_foreignkey.asp

[^9]: https://www.c-sharpcorner.com/blogs/difference-between-primary-key-unique-key-and-foreign-key1

[^10]: https://herovired.com/learning-hub/blogs/difference-between-primary-key-and-foreign-key/

