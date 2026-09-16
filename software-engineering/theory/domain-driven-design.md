# Domain Driven Design

[Back to the topic index](./README.md)

**Domain-Driven Design (DDD)** is a software development approach that centers the design and implementation of software around the **core business domain** and its logic, rather than focusing primarily on technical concerns or infrastructure[^1] [^3] [^5]. The philosophy was introduced by Eric Evans in his influential 2003 book, _Domain-Driven Design: Tackling Complexity in the Heart of Software_[^1] [^2] [^4].

### Key Principles of Domain-Driven Design

- **Focus on the Domain:** DDD emphasizes a deep understanding of the specific problem area (domain) the software is intended to address. This involves close collaboration between developers and domain experts to accurately model the business concepts and rules[^1] [^3] [^5].
- **Ubiquitous Language:** DDD promotes the use of a **common, shared language** between technical and business teams. This language is reflected in both discussions and the codebase, ensuring that all stakeholders have a clear understanding of the system and reducing miscommunication[^1] [^2] [^4].
- **Model-Driven Design:** The software is structured around a **domain model**—a set of abstractions (entities, value objects, aggregates, etc.) that represent the key concepts and behaviors of the business domain[^1] [^2] [^4].
- **Iterative Collaboration:** DDD encourages ongoing, iterative collaboration between developers and business stakeholders, allowing the model and software to evolve as understanding deepens or business needs change[^1] [^5].
- **Strategic Design:** DDD provides tools for organizing large, complex systems, such as **bounded contexts** (clearly defined boundaries within which a particular model applies) and **context mapping** (defining relationships between different contexts)[^3][^4].

### Core Concepts

| Concept             | Description                                                                                             |
| :------------------ | :------------------------------------------------------------------------------------------------------ |
| **Entity**          | An object defined by its identity, not just its attributes (e.g., a customer with a unique ID)[^2][^4]. |
| **Value Object**    | An immutable object identified only by its attributes (e.g., a date range or address)[^2][^4].          |
| **Aggregate**       | A cluster of domain objects treated as a single unit for data changes, with a root entity[^2][^4].      |
| **Repository**      | Provides methods for retrieving and storing domain objects from a data store[^2].                       |
| **Service**         | Represents operations or actions that don’t naturally fit within entities or value objects[^2].         |
| **Domain Event**    | An event that signifies something important has happened within the domain[^2][^3].                     |
| **Bounded Context** | A logical boundary within which a particular domain model is defined and applicable[^3][^4].            |

### Benefits

- **Aligns software with business needs**, ensuring the system reflects real-world processes and requirements[^1] [^5].
- **Improves communication** among team members and stakeholders by using a shared language[^1] [^2].
- **Helps manage complexity** in large systems by breaking them into smaller, well-defined contexts[^3] [^4].
- **Facilitates adaptability** as business requirements evolve, due to the iterative and collaborative approach[^1] [^5].

### When to Use DDD

DDD is most beneficial for **complex projects with intricate business logic** or domains that require deep modeling and understanding[^1] [^3] [^5]. For simple CRUD applications or systems with minimal business rules, the overhead of DDD may not be justified.

In summary, **Domain-Driven Design** is about building software that truly models and serves the core business domain, using a shared language and iterative, collaborative modeling to ensure the system remains aligned with business goals and complexity is managed effectively[^1] [^2] [^3] [^4] [^5].

[^1]: https://www.techtarget.com/whatis/definition/domain-driven-design
[^2]: https://en.wikipedia.org/wiki/Domain-driven_design
[^3]: https://www.geeksforgeeks.org/system-design/domain-driven-design-ddd/
[^4]: https://martinfowler.com/bliki/DomainDrivenDesign.html
[^5]: https://domain-driven-software.com/an-introduction-to-domain-driven-design-ddd-1025bce518c2
[^6]: https://domaindrivendesign.org/ddd-domain-driven-design/
[^7]: https://blog.bytescrum.com/a-comprehensive-guide-to-domain-driven-design-ddd-with-a-practical-folder-structure-example
[^8]: https://dev.to/ruben_alapont/domain-driven-design-ddd-paradigm-a-comprehensive-guide-4473
