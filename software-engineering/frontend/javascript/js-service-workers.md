# Service Worker
A **Service Worker** is a special JavaScript program that runs **in the background of a website**, separately from the web page itself.

The easiest way to think about it:

> **A service worker is a middleman between your web app and the network/browser.**

### Without a service worker

```
Browser
   ↓
Website
   ↓
Internet
   ↓
Server
```

Every time your app needs something, it normally goes to the network.

### With a service worker

```
                 ┌── Internet ──→ Server
                 │
Browser → Service Worker
                 │
                 └── Cache
```

The service worker can decide:

> "Do I already have this? If yes, I'll give it to you from the cache."

## What are they used for?

### 1\. Offline websites

You can cache your application's files:

```
index.html
app.js
styles.css
logo.png
```

Then if the user loses internet:

```
User
 ↓
Web App
 ↓
Service Worker
 ↓
Cache
```

The app can **continue working offline**.

This is one of the key technologies behind **Progressive Web Apps (PWAs)**.

### 2\. Caching

A service worker can intercept network requests:

```
self.addEventListener("fetch", event => {
    console.log("Request:", event.request.url);
});
```

It can then choose whether to:

-   use the cache
-   fetch from the internet
-   use cache first and update in the background
-   return a fallback
-   etc.

### 3\. Push notifications

Service workers can receive push events even when your web page isn't currently open.

For example:

```
Server
   ↓
Push notification
   ↓
Service Worker
   ↓
"New message!"
```

That's why websites can behave somewhat like native apps.

### 4\. Background tasks

They can also handle certain background operations, such as processing events or synchronizing data when connectivity returns.

---

## Important: it's NOT the same as a Web Worker

These are easy to confuse.

**Web Worker:**

```
Main page
   ↓
Web Worker
   ↓
Heavy JavaScript computation
```

Used to move CPU-intensive JavaScript off the main UI thread.

**Service Worker:**

```
Browser
   ↓
Service Worker
   ↓
Network / Cache / Push
```

Used primarily for **network interception, caching, offline behavior, push, and background web-app functionality**.

---

## A real-world example

Imagine you build a React app.

Normally:

```
React app
   ↓
GET /api/products
   ↓
Internet
   ↓
Backend
```

With a service worker, you could have:

```
React app
   ↓
Service Worker
   ↓
Is /api/products cached?
    ↙        ↘
  YES         NO
   ↓           ↓
Cache       Backend
```

This can make an app feel much faster and allow parts of it to work without connectivity.

### One important limitation

A service worker **doesn't run like a normal always-on background process**. The browser can start and stop it as needed. You shouldn't think of it as a server running continuously on the user's machine.

So, in one sentence:

> **A service worker is browser-managed JavaScript that sits behind a web app and can intercept network requests, manage caches, enable offline functionality, receive push notifications, and perform certain background tasks.**