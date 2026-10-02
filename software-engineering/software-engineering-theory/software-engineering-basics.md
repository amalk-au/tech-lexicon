# Software Engineering Basics

[Back to the topic index](./README.md)

**Software engineering theories** are foundational concepts and principles that guide the design, development, and maintenance of high-quality software systems. These theories help ensure software is reliable, maintainable, scalable, and adaptable to changing requirements.

## Core Principles of Software Engineering

The most widely recognized theoretical foundations in software engineering include:

- **Modularity**: Divides software into independent, manageable modules. This enables parallel development, easier maintenance, and reusability[^1] [^2].
- **Abstraction**: Hides complex implementation details, exposing only what is necessary. This reduces complexity and enhances security and usability[^1] [^2].
- **Encapsulation**: Restricts direct access to an object’s internal state, requiring all interaction through defined interfaces. This protects data integrity and simplifies maintenance [^1].
- **Cohesion**: Measures how closely related the functions within a module are. High cohesion means a module focuses on a single task, improving maintainability and robustness [^1].
- **Coupling**: Refers to the degree of dependency between modules. Low coupling is preferred, as it makes systems more flexible and easier to modify [^1].

### SOLID Principles

For object-oriented design, the **SOLID** principles are a cornerstone:

- **Single Responsibility Principle (SRP)**: Each class or module should have one reason to change—focus on a single responsibility[^3].
- **Open/Closed Principle (OCP)**: Software entities should be open for extension but closed for modification, promoting extensibility without altering existing code [^3].
- **Liskov Substitution Principle (LSP)**: Subtypes must be substitutable for their base types without altering the correctness of the program [^5].
- **Interface Segregation Principle (ISP)**: Prefer many specific interfaces over a single general-purpose interface[^5].
- **Dependency Inversion Principle (DIP)**: Depend on abstractions, not concrete implementations[^5].

## Arrange-Act-Assert

A pattern for arranging and formatting code in UnitTest methods: Each method should group these functional sections, separated by blank lines:Arrange all necessary preconditions and inputs. Act on the object or method under test.Assert that the expected results have occurred.

## Given-When-Then (GWT)

Is a semi-structured way to write down test cases. They can either be tested manually or automated as browser git sttests with tools like Selenium and Cucumber. It derives its name from the three clauses used, which start with the words given, when and then.Given describes the preconditions and initial state before the start of a test and allows for any pre-test setup that may occur. When describes actions taken by a user during a test. Then describes the outcome resulting from actions taken in the when clause. The Given-When-Then was proposed by Dan North in 2006, as part of behavior-driven development.

### Additional Theoretical Foundations

- **Separation of Concerns**: Each part of a program should address a separate concern, minimizing overlap and making the system easier to develop and maintain [^3].
- **Phased Life-Cycle Management**: Use a structured life-cycle plan (requirements, design, implementation, testing, maintenance) to manage complexity and ensure quality [^4].
- **Continuous Validation and Disciplined Control**: Regularly validate software against requirements and maintain strict control over changes to ensure reliability and traceability [^4].
- **KISS Principle (Keep It Simple, Stupid)**: Strive for simplicity in design and implementation, making systems easier to understand and maintain [^5].
- **Requirement Analysis**: Thoroughly analyze and understand user requirements to ensure the software delivers value and meets user needs [^5].

### Theoretical Models and Theorems

- **Fundamental Theorem of Software Engineering**: Suggests that "we can solve any problem by introducing an extra level of indirection," emphasizing the power of abstraction and modularity [^6].
- **Seven Basic Principles (Boehm)**: Manage with a phased plan, perform continuous validation, maintain disciplined control, use modern practices, ensure accountability, use better people, and commit to process improvement[^4] [^7].

### Summary Table

| Principle/Theory       | Purpose/Benefit                        |
| :--------------------- | :------------------------------------- |
| Modularity             | Manageability, parallel development    |
| Abstraction            | Simplicity, reduced complexity         |
| Encapsulation          | Data protection, easier maintenance    |
| Cohesion               | Focused modules, easier updates        |
| Coupling               | Flexibility, risk isolation            |
| SOLID Principles       | Maintainability, extensibility (OOP)   |
| Separation of Concerns | Clear organization, easier development |
| KISS Principle         | Simpler, more maintainable code        |
| Requirement Analysis   | Software meets user needs              |
