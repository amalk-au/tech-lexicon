## Five Common Mistakes Software Engineers Make Solving the IRC Client Coding Challenge, By John Crickett

[Back to the topic index](./README.md)

https://codingchallenges.fyi/challenges/challenge-irc/ 

I’ve pulled together this list of common mistakes from the hundreds of submissions I’ve been sent privately and the many shared in the Coding Challenges Shared Solutions GitHub Repo.

Mistake 1 - Not Parsing The Protocol
When handling a protocol, build a parser for it. Don’t try to handle it with regular expressions. Building a parser will be more robust, easier to extend and maintain, and easier to test.

In the case of IRC it’ll also be easier to build and reason about as the RFC specifics the protocol in augmented BNF (Backus-Naur Form - a notation that describes a formal grammar used when creating parsers) making it relatively easy to translate to a parser.

If you’re not sure how to write a parser check out my Interpreter course where I’ll cover writing one for a programming language or the Redis course where we look at it specifically from the point of view of parsing a network protocol (RESP).

Mistake 2 - Hard Coded Server And Port
Hard coding the server and port into your client means it can only be used to connect to a single server. That’s not only pointless, it also misses the benefit of the IRC network.

IRC is design to be distributed and resilient. Each network consists of several servers and the clients can connect to any server and ‘chat’ to any of the clients on the network whichever server they are connected to.

It also means that if a server is down, you can simply connect to a different server. So don’t hard code the server and port in your IRC client, or any other network client. It makes them far less useful.

Mistake 3 - Magic Numbers
A magic number is a unique value with no obvious meaning. Magic numbers are one of the oldest anti-patterns in software programming. They’re a problem because they obscure the programmer’s intent.

Instead of magic numbers it’s better to use named constant variables, where the name makes it clear what the constant refers to. For example, consider these two equivalent calls:

socket(2, 1, 0)
socket(AF_INET, SOCK_STREAM, PF_INET)
Hopefully you’ll agree the second is clearer and if you’re familiar with socket programming you’ll know immediately what it means, unlike the first.

Mistake 4 - Long Functions
The longer a function is the harder it is to reason about. The harder it is to reason about the harder it is to review for correctness or test.

It doesn’t stop there though, once a function gets over 20-30 lines of code it becomes impossible for most of us to ‘hold’ all the context in our heads. We therefore struggle to reason about it and are more likely to introduce bugs when we change it.

For that reason I recommend keeping functions short, ideally less than 20ish lines of code. Note I added ‘ish’, because you need to think about this. If the function is 25 lines long and does one clear well defined thing it’s probably fine as one function, whereas breaking it into two or three other functions might create a bigger increase in cognitive load.

Mistake 5 - Unused And Unnecessary Dependencies
Dependencies are a potential source of bugs, instability and an attach vector for bad actors.

When building software try to keep your dependencies to a minimum.

Don’t install any that you don’t need.

Don’t install any that aren’t well known.

Don’t install them from a non standard source.

Don’t install any that offer no advantage over the programming language’s standard library.

Pin all the dependencies so the behaviour is consistent.

Where possible keep a local mirror of the dependencies, so if an upstream source is compromised or unavailable you are still able to build and deploy safely.