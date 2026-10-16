## What is a cron job?

In **Ubuntu Linux**, a **cron job** is a command or script that Linux automatically runs at a scheduled time.

Think of it as a built-in **alarm clock for your computer**:

> "Run this command every day at 2:00 AM."

Cron is useful for repetitive tasks such as:

-   Backing up files
-   Running scripts
-   Cleaning temporary files
-   Sending reports
-   Updating databases
-   Checking services
-   Rotating logs
-   Running maintenance tasks

The service responsible for this is called **cron** (or a cron daemon).

---

## 1\. The basic idea

Suppose you have a script:

```
/home/alex/scripts/backup.sh
```

You could tell Ubuntu:

> Run `backup.sh` every day at 2:00 AM.

You do this by adding a **cron entry** (also called a *crontab entry*).

You can edit your personal cron jobs with:

```
crontab -e
```

You might add:

```
0 2 * * * /home/alex/scripts/backup.sh
```

This means:

```
│ │ │ │ │
│ │ │ │ └── Day of week
│ │ │ └──── Month
│ │ └────── Day of month
│ └──────── Hour
└────────── Minute
```

So:

```
0 2 * * *
```

means:

> At minute 0, hour 2, every day, every month, every day of the week.

In other words:

**Every day at 2:00 AM.**

---

## 2\. Understanding the five fields

A normal cron schedule has five time fields:

```
* * * * * command
│ │ │ │ │
│ │ │ │ └─ Day of week (0-7)
│ │ │ └─── Month (1-12)
│ │ └───── Day of month (1-31)
│ └─────── Hour (0-23)
└───────── Minute (0-59)
```

The `*` means **"any value."**

For example:

### Every minute

```
* * * * * /path/to/script.sh
```

### Every hour

```
0 * * * * /path/to/script.sh
```

Runs at:

```
1:00
2:00
3:00
...
```

### Every day at 6:30 PM

```
30 18 * * * /path/to/script.sh
```

### Every Sunday at 3:00 AM

```
0 3 * * 0 /path/to/script.sh
```

### Every 15 minutes

```
*/15 * * * * /path/to/script.sh
```

The `*/15` means:

> Every 15 minutes.

---

## 3\. Cron vs crontab

These two terms are often confused.

**Cron** is the background service that watches for scheduled tasks and runs them.

**Crontab** is the configuration containing the scheduled tasks.

You can think of it like:

```
cron
 │
 ├── reads your crontab
 │
 ├── waits for scheduled times
 │
 └── executes your commands
```

To see your current user's cron jobs:

```
crontab -l
```

To edit them:

```
crontab -e
```

To remove all of your user's cron jobs:

```
crontab -r
```

Be careful with `-r`—it removes the crontab without asking in some environments.

---

## 4\. User cron jobs vs system cron jobs

Ubuntu has several places where scheduled tasks can be configured.

### User crontab

When you run:

```
crontab -e
```

you're editing cron jobs for your current user.

For example:

```
0 2 * * * /home/alex/scripts/backup.sh
```

That command runs with **your user's permissions**.

---

### System-wide cron

Ubuntu also has:

```
/etc/crontab
```

and directories such as:

```
/etc/cron.hourly/
/etc/cron.daily/
/etc/cron.weekly/
/etc/cron.monthly/
```

A major difference is that `/etc/crontab` includes a **user field**.

For example:

```
0 2 * * * root /usr/local/bin/backup.sh
```

The format is:

```
minute hour day-of-month month day-of-week user command
```

So this says:

> At 2:00 AM every day, run `/usr/local/bin/backup.sh` as `root`.

---

## 5\. An important Ubuntu example

Imagine you want to run a Python script every day.

Your script is:

```
/home/alex/myapp/report.py
```

You might initially try:

```
0 8 * * * python /home/alex/myapp/report.py
```

But there are a couple of problems.

Cron runs with a **different environment** from your normal interactive terminal. For example, its `PATH` may be different.

It's generally safer to use an absolute path:

```
which python3
```

Suppose Ubuntu returns:

```
/usr/bin/python3
```

Then:

```
0 8 * * * /usr/bin/python3 /home/alex/myapp/report.py
```

Now Ubuntu knows exactly which Python executable to use.

---

## 6\. Output and logging

Suppose you have:

```
0 2 * * * /home/alex/scripts/backup.sh
```

Your script might produce output or errors.

You can redirect them to a log file:

```
0 2 * * * /home/alex/scripts/backup.sh >> /home/alex/backup.log 2>&1
```

Here:

```
>>
```

means append output to the file.

And:

```
2>&1
```

means redirect standard error (`stderr`) to the same place as standard output (`stdout`).

So you'll have a record of what happened.

---

## 7\. Cron's environment can surprise you

One of the most common beginner problems is:

> "My script works perfectly when I run it manually, but it doesn't work from cron."

That's often because cron doesn't have exactly the same environment as your terminal.

For example, you might manually run:

```
python3 /home/alex/app.py
```

and it works.

But your cron job might fail because:

-   `PATH` is different
-   Environment variables aren't defined
-   The working directory isn't what you expect
-   A virtual environment isn't activated
-   File permissions are different
-   Relative paths point somewhere unexpected

A robust cron script should therefore use **absolute paths** where practical.

For example, prefer:

```
/home/alex/app/data/input.txt
```

over:

```
data/input.txt
```

---

## 8\. Cron and permissions

Suppose you create:

```
/home/alex/scripts/backup.sh
```

Make it executable:

```
chmod +x /home/alex/scripts/backup.sh
```

Then your crontab can contain:

```
0 2 * * * /home/alex/scripts/backup.sh
```

Remember that cron doesn't magically give you additional privileges.

If your user can't normally do:

```
some-command
```

cron won't make it work.

For system-level jobs requiring root privileges, Ubuntu also provides mechanisms such as **root's crontab**:

```
sudo crontab -e
```

But be careful when scheduling commands as root.

---

## 9\. Checking whether cron is running

On modern Ubuntu systems, you can check the cron service with:

```
systemctl status cron
```

You can start it with:

```
sudo systemctl start cron
```

And enable it to start automatically when Ubuntu boots:

```
sudo systemctl enable cron
```

Usually Ubuntu has cron configured to run automatically.

---

## 10\. Cron isn't the only scheduling system in Ubuntu

This is an important modern-Linux distinction.

Ubuntu also uses **systemd**, which provides **systemd timers**.

For example, you can schedule a service using:

```
something.service
something.timer
```

Systemd timers can be more sophisticated than traditional cron, particularly when you need things like:

-   Dependencies on other services
-   Better logging through `journalctl`
-   More precise control
-   Jobs that should run after boot
-   Handling missed executions

But **cron is still extremely useful**, especially for simple recurring commands and scripts.

---

## A simple mental model

If you're learning Ubuntu, remember this:

```
              Ubuntu
                 │
             cron service
                 │
          reads crontab
                 │
       ┌─────────┴─────────┐
       │                   │
   schedule             command
       │                   │
 "Every day at 2 AM"   "run backup.sh"
       │                   │
       └─────────┬─────────┘
                 ↓
          command executes
```

And the basic syntax to memorize is:

```
* * * * * command
│ │ │ │ │
│ │ │ │ └── weekday
│ │ │ └──── month
│ │ └────── day
│ └──────── hour
└────────── minute
```

**The most important commands to start with are:**

```
crontab -l       # list your cron jobs
crontab -e       # edit your cron jobs
systemctl status cron
```

If you're learning this for **Ubuntu administration**, the next useful step is understanding **how to write cron expressions**, with examples like "every 5 minutes," "Monday–Friday at 9 AM," and "the first day of every month."