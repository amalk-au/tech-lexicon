# WordPress & PHP: Revision Through Practice

A copyable reference and practical lab for self-hosted WordPress on an Ubuntu Server virtual machine. Build a small **Notes Lab** site while revising PHP, themes, plugins, JavaScript, HTML, and CSS.

All domains, accounts, and content below are fictional examples. Create passwords locally; keep them out of this document and Git.

**Baseline:** Ubuntu Server **24.04 LTS**, Apache, PHP **8.3**, MariaDB **10.11**, and a current stable WordPress release. This is a deliberate learning baseline, not a claim that 24.04 is the newest Ubuntu release. On another Ubuntu version, check the installed PHP and database versions. WordPress recommends PHP 8.3+, MariaDB 10.11+ or MySQL 8.0+, and HTTPS. The HTTP setup here is for an isolated VM lab; use HTTPS when deploying publicly. [Requirements](https://wordpress.org/about/requirements/)

**Tool roles:** PHP runs WordPress on the server. MariaDB stores content. Apache handles HTTP requests. JavaScript runs in the browser. **pnpm** manages optional frontend build tools; it does not install PHP or run WordPress.

## Contents

1. [Learning route](#1-learning-route)
2. [Set up the Ubuntu VM](#2-set-up-the-ubuntu-vm)
3. [WordPress concepts to revise](#3-wordpress-concepts-to-revise)
4. [PHP essentials](#4-php-essentials)
5. [Create a classic theme](#5-create-a-classic-theme)
6. [Create the Notes Lab plugin](#6-create-the-notes-lab-plugin)
7. [Add a public REST endpoint](#7-add-a-public-rest-endpoint)
8. [Save metadata safely](#8-save-metadata-safely)
9. [Add a settings page](#9-add-a-settings-page)
10. [Add browser JavaScript and CSS](#10-add-browser-javascript-and-css)
11. [Activate and try the project](#11-activate-and-try-the-project)
12. [Try custom HTML](#12-try-custom-html)
13. [Add a dynamic editor block](#13-add-a-dynamic-editor-block)
14. [Use pnpm for frontend builds](#14-use-pnpm-for-frontend-builds)
15. [Database and query revision](#15-database-and-query-revision)
16. [Debugging and verification](#16-debugging-and-verification)
17. [Keep custom work in Git](#17-keep-custom-work-in-git)
18. [Practice challenges and revision checklist](#18-practice-challenges-and-revision-checklist)
19. [Official references](#19-official-references)

## 1. Learning route

Work in this order. Sections 6–10 supply all files needed by the plugin; create them before activation.

| Stage | Build                       | Concepts                                    |
| ----- | --------------------------- | ------------------------------------------- |
| 1     | A working VM installation   | Apache, PHP, database credentials, WP-CLI   |
| 2     | A small CLI PHP script      | Arrays, types, functions, conditions, loops |
| 3     | A custom classic theme      | Template hierarchy, the Loop, asset loading |
| 4     | A notes plugin              | Hooks, post types, taxonomies, shortcodes   |
| 5     | Level metadata and settings | Nonces, capabilities, validation, options   |
| 6     | Search and a counter        | REST, fetch, DOM events, accessible HTML    |
| 7     | A dynamic block and builds  | Block metadata, server rendering, pnpm      |

**Success target:** create published notes with topics and levels; list them using a shortcode or block; search them without reloading; change a banner in Settings.

## 2. Set up the Ubuntu VM

### 2.1 VM and network

Suggested VM resources: 2 virtual CPUs, 4 GB RAM, and 25 GB disk. Install Ubuntu Server 24.04 LTS and enable OpenSSH during installation if remote editing is useful.

Use a **host-only adapter** for laptop-to-VM access and a **NAT adapter** for VM internet access. Keep the lab on the private VM network. A VM snapshot after installation gives you a quick reset point.

Run the following **inside the VM**:

```bash
hostname -I
sudo apt update
sudo apt install -y apache2 mariadb-server php libapache2-mod-php \
  php-cli php-mysql php-curl php-mbstring php-xml php-zip \
  php-gd php-intl php-bcmath curl unzip git rsync openssl

sudo systemctl enable --now apache2 mariadb
php --version
mariadb --version
```

This installs the web server, PHP interpreter/extensions, database, and command-line tools. The expected major versions on the baseline are PHP 8.3 and MariaDB 10.11.

On the **laptop**, edit `/etc/hosts` using `sudo nano /etc/hosts` and add this entry, replacing the example address with the VM's host-only IP:

```text
192.168.56.10 wp-lab.test
```

Inside the **VM**, add this separate entry to its `/etc/hosts`:

```text
127.0.0.1 wp-lab.test
```

The laptop reaches the VM; the VM can reach its own site for loopback requests. Use the same canonical site URL, `http://wp-lab.test`, throughout. `localhost` on the laptop refers to the laptop.

Edit the named files with `nano` inside the VM, or connect an editor over SSH. From the laptop, `ssh VM_LOGIN@wp-lab.test` opens a shell after replacing `VM_LOGIN` with the VM's login account. The `/var/www/wp-lab` directory is the project root.

If UFW is already active, allow SSH and HTTP from the actual host-only subnet. For the example network:

```bash
sudo ufw status
# Run these only if the host-only subnet really is 192.168.56.0/24.
sudo ufw allow from 192.168.56.0/24 to any port 22 proto tcp
sudo ufw allow from 192.168.56.0/24 to any port 80 proto tcp
```

These rules allow access within the lab subnet. Change the subnet to match the VM network.

### 2.2 Install WP-CLI and download WordPress

**Inside the VM**, as the normal login user:

```bash
curl -fsSL https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
  -o /tmp/wp-cli.phar
php /tmp/wp-cli.phar --info
sudo install -m 0755 /tmp/wp-cli.phar /usr/local/bin/wp

sudo install -d -o "$USER" -g www-data -m 0755 /var/www/wp-lab
cd /var/www/wp-lab
wp core download
wp core version
```

WP-CLI runs WordPress commands from the terminal. The download command fetches the current stable release; record `wp core version` if you want to reproduce an exact version later. Run `wp` as the normal user, without `sudo` or `--allow-root`. [WP-CLI installation](https://make.wordpress.org/cli/handbook/guides/installing/)

### 2.3 Create a database

Generate a database password locally:

```bash
openssl rand -hex 32
sudo env MYSQL_HISTFILE=/dev/null mariadb
```

In the MariaDB prompt, replace the password placeholder before running:

```sql
CREATE DATABASE wp_lab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wp_lab'@'localhost' IDENTIFIED BY 'REPLACE_WITH_A_LONG_RANDOM_PASSWORD';
GRANT ALL PRIVILEGES ON wp_lab.* TO 'wp_lab'@'localhost';
EXIT;
```

This gives one database account access to the lab database. `localhost` keeps database access local. The OS login, database account, and WordPress administrator are separate accounts.

### 2.4 Configure Apache

Create `/etc/apache2/sites-available/wp-lab.conf`:

```bash
sudo tee /etc/apache2/sites-available/wp-lab.conf > /dev/null <<'APACHE'
<VirtualHost *:80>
    ServerName wp-lab.test
    DocumentRoot /var/www/wp-lab

    <Directory /var/www/wp-lab>
        Options -Indexes +FollowSymLinks
        AllowOverride FileInfo
        Require all granted
        DirectoryIndex index.php
    </Directory>

    <DirectoryMatch "^/var/www/wp-lab/\.git(?:/|$)">
        Require all denied
    </DirectoryMatch>

    <FilesMatch "^(wp-config\.php|wp-cli\.yml)$">
        Require all denied
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/wp-lab-error.log
    CustomLog ${APACHE_LOG_DIR}/wp-lab-access.log combined
</VirtualHost>
APACHE

sudo a2enmod rewrite
sudo a2ensite wp-lab.conf
sudo a2dissite 000-default.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

The virtual host serves the WordPress directory. `rewrite` and `.htaccess` support readable URLs. Directory listing is disabled, and direct HTTP access to Git metadata and the configuration file is denied. The quoted heredoc preserves Apache's `${APACHE_LOG_DIR}` variable.

### 2.5 Configure and install WordPress

```bash
cd /var/www/wp-lab
wp config create --dbname=wp_lab --dbuser=wp_lab \
  --dbhost=localhost --dbcharset=utf8mb4 --prompt=dbpass

wp core install --url='http://wp-lab.test' --title='Notes Lab' \
  --admin_user=lab_editor --admin_email=editor@example.test \
  --skip-email --prompt=admin_password

sudo chgrp -R www-data /var/www/wp-lab
chmod 640 wp-config.php
sudo install -d -o "$USER" -g www-data -m 2775 wp-content/uploads

cat > wp-cli.yml <<'YAML'
apache_modules:
  - mod_rewrite
YAML

wp rewrite structure '/%postname%/' --hard
wp option update blog_public 0
wp core verify-checksums
```

Enter the database password at the first prompt and a different WordPress password at the second. WP-CLI creates salts in `wp-config.php`. The `.test` email is a placeholder; this lab does not require outgoing mail.

`wp-cli.yml` tells WP-CLI that Apache supports `mod_rewrite`, allowing `--hard` to regenerate `.htaccess`. This configuration contains no credentials. [Rewrite configuration](https://developer.wordpress.org/cli/commands/rewrite/flush/)

Core and custom code stay writable by the login user. Apache can write to uploads. Use WP-CLI for plugin/theme installs and updates; the dashboard may ask for FTP credentials because PHP cannot write the code directories. Avoid `chmod 777`. [Configuration command](https://developer.wordpress.org/cli/commands/config/create/)

Open `http://wp-lab.test/wp-admin/` on the laptop. If this fails, resolve networking and Apache before continuing.

### 2.6 Enable development logging

```bash
cd /var/www/wp-lab
sudo install -d -o www-data -g www-data -m 0750 /var/log/wp-lab
wp config set WP_ENVIRONMENT_TYPE local
wp config set WP_DEBUG true --raw
wp config set WP_DEBUG_DISPLAY false --raw
wp config set WP_DEBUG_LOG /var/log/wp-lab/debug.log
wp config set SCRIPT_DEBUG true --raw
wp config set DISALLOW_FILE_EDIT true --raw
```

Errors go to a file outside the web root instead of appearing in page HTML. `SCRIPT_DEBUG` uses development versions of WordPress core assets. `DISALLOW_FILE_EDIT` disables the dashboard code editor; edit source files directly. Before public deployment, disable debugging and configure HTTPS.

## 3. WordPress concepts to revise

| Concept       | What it means                                       | Example in this lab              |
| ------------- | --------------------------------------------------- | -------------------------------- |
| Core          | WordPress itself; update it through supported tools | `wp-admin`, `wp-includes`        |
| Theme         | Page presentation and templates                     | `lab-theme`                      |
| Plugin        | Site functionality independent of the theme         | `lab-notes`                      |
| Action        | Run a callback at an event                          | Register content types on `init` |
| Filter        | Receive a value, modify it, return it               | Append a banner to note content  |
| Post type     | Kind of stored content                              | `post`, `page`, `lab_note`       |
| Taxonomy      | Classify content using terms                        | `lab_topic` with PHP/CSS topics  |
| Post metadata | Additional fields for one post                      | `lab_level`                      |
| Option        | A site-wide setting                                 | `lab_notes_banner`               |
| Shortcode     | Text replaced by generated output                   | `[lab_notes limit="4"]`          |
| Block         | Structured content in the block editor              | `lab/notes`                      |
| REST API      | HTTP interface returning JSON                       | `/wp-json/lab/v1/notes`          |

PHP creates page HTML during a server request. After the browser receives it, JavaScript can change the DOM or make another HTTP request. Changing a browser variable does not automatically change a PHP variable or database row.

Prefix global functions, handles, options, and post types to avoid collisions. This lab uses `lab_` and `lab_notes_`. In larger plugins, namespaces/classes can organize code further.

## 4. PHP essentials

### 4.1 Quick language comparison

| Task                     | PHP                                   | Reminder                                                  |
| ------------------------ | ------------------------------------- | --------------------------------------------------------- |
| Variable                 | `$count = 3;`                         | Variables start with `$`; statements usually end with `;` |
| String concatenation     | `$a . $b`                             | Use `.` instead of JavaScript's `+`                       |
| Interpolation            | `"Hello {$topic}"`                    | Double quotes interpolate; single quotes usually do not   |
| Associative array        | `['topic' => 'PHP']`                  | Access with `$data['topic']`                              |
| Strict comparison        | `$level === 'beginner'`               | Compares value and type                                   |
| Default for missing/null | `$data['level'] ?? 'beginner'`        | Does not replace an empty string                          |
| Loop                     | `foreach ($items as $item)`           | Can also iterate `$key => $value`                         |
| Function type            | `function total(int $n): int`         | Optional parameter and return declarations                |
| Object access            | `$query->posts`                       | `->` accesses instance properties/methods                 |
| Static access            | `WP_REST_Server::READABLE`            | `::` accesses constants/static members                    |
| Include                  | `require_once __DIR__ . '/file.php';` | Resolve relative to the current file                      |
| Arrow function           | `fn($n) => $n * 2`                    | Automatically captures outer variables by value           |

### 4.2 A standalone PHP exercise

Create this outside the web root:

```bash
mkdir -p ~/wp-lab-php
nano ~/wp-lab-php/basics.php
```

**File: `~/wp-lab-php/basics.php`**

```php
<?php
declare(strict_types=1);

$notes = [
    ['title' => 'Actions', 'minutes' => 15, 'done' => true],
    ['title' => 'Filters', 'minutes' => 20, 'done' => false],
];

function describe_note(array $note): string {
    $status = $note['done'] ? 'complete' : 'pending';
    return "{$note['title']}: {$status}";
}

$total = 0;
foreach ($notes as $note) {
    $total += $note['minutes'];
    echo describe_note($note) . PHP_EOL;
}

$pending = array_filter($notes, fn(array $note): bool => !$note['done']);
$topic = $notes[0]['topic'] ?? 'General';

echo "Total: {$total} minutes" . PHP_EOL;
echo 'Pending: ' . count($pending) . PHP_EOL;
echo "Topic: {$topic}" . PHP_EOL;
```

Run:

```bash
php -l ~/wp-lab-php/basics.php
php ~/wp-lab-php/basics.php
```

**What it does:** loops through associative arrays, calls a typed function, filters unfinished work, and supplies a missing-field default. `php -l` checks syntax without executing the script. `strict_types` applies to scalar calls made from this file; WordPress hook arguments still need validation.

**Check:** total is `35`, pending count is `1`, and topic is `General`.

**Try:** add a third note and a function that returns the average minutes. Then call a function declared with an `int` parameter using a string and inspect the resulting `TypeError` under strict typing.

## 5. Create a classic theme

This small theme exposes the PHP template system directly. A block theme instead uses files such as `templates/index.html`, block markup, and `theme.json`; learn that workflow after understanding the request/render cycle. A classic theme can still display content created in the block editor.

Run in the VM:

```bash
cd /var/www/wp-lab
mkdir -p wp-content/themes/lab-theme
```

Create all five files below in that directory. Each code block is the complete file.

### File: `wp-content/themes/lab-theme/style.css`

```css
/*
Theme Name: Lab Theme
Description: A minimal classic theme for WordPress revision.
Version: 1.0.0
Requires PHP: 8.3
Text Domain: lab-theme
*/

:root {
  --lab-ink: #172033;
  --lab-accent: #174ea6;
  --lab-surface: #f3f6fc;
}

* {
  box-sizing: border-box;
}
body {
  margin: 0;
  color: var(--lab-ink);
  font:
    1rem/1.6 system-ui,
    sans-serif;
}
a {
  color: var(--lab-accent);
}
.lab-wrap {
  width: min(70rem, 92%);
  margin-inline: auto;
}
.lab-site-header,
.lab-site-footer {
  background: var(--lab-surface);
  padding: 1rem 0;
}
main {
  padding-block: 2rem;
}
.lab-entry {
  margin-block: 0 2rem;
  overflow-wrap: anywhere;
}
img {
  max-width: 100%;
  height: auto;
}
.lab-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  padding: 0;
}
:focus-visible {
  outline: 3px solid var(--lab-accent);
  outline-offset: 3px;
}
.lab-skip {
  position: absolute;
  left: -9999px;
}
.lab-skip:focus {
  left: 1rem;
  top: 1rem;
  background: white;
  padding: 0.75rem;
  z-index: 1000;
}
```

**What it does:** the header comment identifies the theme; the CSS provides a readable layout, fluid images, visible keyboard focus, and a skip link.

### File: `wp-content/themes/lab-theme/functions.php`

```php
<?php
defined('ABSPATH') || exit;

function lab_theme_setup(): void {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);
    register_nav_menus(['primary' => 'Primary navigation']);
}
add_action('after_setup_theme', 'lab_theme_setup');

function lab_theme_assets(): void {
    wp_enqueue_style(
        'lab-theme',
        get_stylesheet_uri(),
        [],
        (string) filemtime(get_stylesheet_directory() . '/style.css')
    );
}
add_action('wp_enqueue_scripts', 'lab_theme_assets');
```

**What it does:** enables theme features and loads CSS through WordPress. The file modification time changes the asset URL version while developing.

### File: `wp-content/themes/lab-theme/header.php`

```php
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php echo esc_attr(get_bloginfo('charset')); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="lab-skip" href="#main">Skip to content</a>
<header class="lab-site-header">
    <div class="lab-wrap">
        <a href="<?php echo esc_url(home_url('/')); ?>">
            <?php echo esc_html(get_bloginfo('name')); ?>
        </a>
        <nav aria-label="Primary">
            <?php
            wp_nav_menu([
                'theme_location' => 'primary',
                'container' => false,
                'menu_class' => 'lab-menu',
                'fallback_cb' => false,
            ]);
            ?>
        </nav>
    </div>
</header>
```

**What it does:** outputs the page shell and navigation. `wp_head()` lets WordPress/plugins insert styles and other head content; `wp_body_open()` exposes the body-opening hook.

### File: `wp-content/themes/lab-theme/footer.php`

```php
<footer class="lab-site-footer">
    <div class="lab-wrap">
        <p>Notes Lab &middot; <?php echo esc_html(wp_date('Y')); ?></p>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
```

**What it does:** closes the page and calls `wp_footer()`, which prints footer scripts and other plugin output.

### File: `wp-content/themes/lab-theme/index.php`

```php
<?php get_header(); ?>
<main id="main" class="lab-wrap" tabindex="-1">
    <?php if (have_posts()) : ?>
        <?php while (have_posts()) : the_post(); ?>
            <article <?php post_class('lab-entry'); ?>>
                <?php if (is_singular()) : ?>
                    <h1><?php echo esc_html(get_the_title()); ?></h1>
                    <?php the_content(); ?>
                    <?php wp_link_pages(); ?>
                <?php else : ?>
                    <h2>
                        <a href="<?php echo esc_url(get_permalink()); ?>">
                            <?php echo esc_html(get_the_title()); ?>
                        </a>
                    </h2>
                    <?php the_excerpt(); ?>
                <?php endif; ?>
            </article>
        <?php endwhile; ?>
        <?php if (!is_singular()) { the_posts_pagination(); } ?>
    <?php else : ?>
        <h1>No content yet</h1>
        <p>Publish a post, page, or lab note to begin.</p>
    <?php endif; ?>
</main>
<?php get_footer(); ?>
```

**What it does:** uses the main WordPress **Loop**. Singular requests display full content; lists display excerpts and pagination. `the_content()` intentionally outputs WordPress-managed rich HTML, including shortcodes and blocks.

Activate:

```bash
wp theme activate lab-theme
```

**Check:** the site loads with your CSS. Add a navigation menu under Appearance → Menus and assign it to Primary navigation if desired.

**Template revision:** WordPress selects the most specific available template and falls back toward `index.php`. For this classic theme:

| Request                     | Useful template candidates, from specific to general                                  |
| --------------------------- | ------------------------------------------------------------------------------------- |
| One lab note                | `single-lab_note.php` → `single.php` → `singular.php` → `index.php`                   |
| A page with slug `practice` | `page-practice.php` → `page.php` → `singular.php` → `index.php`                       |
| Notes archive               | `archive-lab_note.php` → `archive.php` → `index.php`                                  |
| Search                      | `search.php` → `index.php`                                                            |
| Posts index                 | `home.php` → `index.php`                                                              |
| Front page                  | `front-page.php` takes precedence; remaining selection depends on front-page settings |

Custom page templates and ID-specific templates add further candidates. [Classic template hierarchy](https://developer.wordpress.org/themes/classic-themes/basics/template-hierarchy/)

**Try:** copy `index.php` to `single-lab_note.php`, add a visible “Note template” label, and confirm it appears only on individual notes.

## 6. Create the Notes Lab plugin

The plugin owns the content model so notes remain registered when you switch themes.

```bash
cd /var/www/wp-lab
mkdir -p wp-content/plugins/lab-notes/includes
mkdir -p wp-content/plugins/lab-notes/assets
```

Create the files from sections **6–10** before activating:

| File under `wp-content/plugins/lab-notes/` | Purpose                                                       |
| ------------------------------------------ | ------------------------------------------------------------- |
| `lab-notes.php`                            | Plugin entry point, content types, shortcodes, assets, filter |
| `includes/rest.php`                        | Public JSON search endpoint                                   |
| `includes/meta.php`                        | Level field and safe saving                                   |
| `includes/settings.php`                    | Site-wide banner setting                                      |
| `assets/lab.js`                            | Search and counter interactions                               |
| `assets/lab.css`                           | Plugin component styling                                      |

### File: `wp-content/plugins/lab-notes/lab-notes.php`

```php
<?php
/**
 * Plugin Name: Notes Lab
 * Description: A practice plugin for notes, metadata, settings, and REST.
 * Version: 1.0.0
 * Requires at least: 6.3
 * Requires PHP: 8.3
 * Text Domain: lab-notes
 */
defined('ABSPATH') || exit;

require_once __DIR__ . '/includes/rest.php';
require_once __DIR__ . '/includes/meta.php';
require_once __DIR__ . '/includes/settings.php';

function lab_notes_register_content(): void {
    register_post_type('lab_note', [
        'labels' => ['name' => 'Lab Notes', 'singular_name' => 'Lab Note'],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'lab-notes',
        'has_archive' => true,
        'rewrite' => ['slug' => 'notes'],
        'menu_icon' => 'dashicons-welcome-learn-more',
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'],
    ]);

    register_taxonomy('lab_topic', ['lab_note'], [
        'labels' => ['name' => 'Topics', 'singular_name' => 'Topic'],
        'public' => true,
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite' => ['slug' => 'note-topic'],
    ]);

    register_post_meta('lab_note', 'lab_level', [
        'type' => 'string',
        'single' => true,
        'default' => 'beginner',
        'sanitize_callback' => 'lab_notes_clean_level',
        'auth_callback' => 'lab_notes_can_edit_level',
        'show_in_rest' => [
            'schema' => [
                'type' => 'string',
                'enum' => ['beginner', 'intermediate', 'advanced'],
            ],
        ],
    ]);
}
add_action('init', 'lab_notes_register_content');

function lab_notes_activate(): void {
    lab_notes_register_content();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'lab_notes_activate');

function lab_notes_deactivate(): void {
    unregister_post_type('lab_note');
    unregister_taxonomy('lab_topic');
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'lab_notes_deactivate');

function lab_notes_assets(): void {
    $url = plugin_dir_url(__FILE__) . 'assets/';
    $dir = __DIR__ . '/assets/';

    wp_enqueue_style('lab-notes', $url . 'lab.css', [], (string) filemtime($dir . 'lab.css'));
    wp_enqueue_script(
        'lab-notes',
        $url . 'lab.js',
        [],
        (string) filemtime($dir . 'lab.js'),
        ['in_footer' => true, 'strategy' => 'defer']
    );

    $config = ['endpoint' => rest_url('lab/v1/notes')];
    wp_add_inline_script(
        'lab-notes',
        'window.LabNotesConfig = ' . wp_json_encode(
            $config,
            JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
        ) . ';',
        'before'
    );
}
add_action('wp_enqueue_scripts', 'lab_notes_assets');

function lab_notes_list_shortcode($atts): string {
    $atts = shortcode_atts(['limit' => '6'], $atts, 'lab_notes');
    $limit = max(1, min(12, absint($atts['limit'])));
    $query = new WP_Query([
        'post_type' => 'lab_note',
        'post_status' => 'publish',
        'has_password' => false,
        'posts_per_page' => $limit,
        'orderby' => 'date',
        'order' => 'DESC',
        'no_found_rows' => true,
    ]);

    ob_start();
    ?>
    <div class="lab-grid">
        <?php while ($query->have_posts()) : $query->the_post(); ?>
            <article class="lab-card">
                <h3>
                    <a href="<?php echo esc_url(get_permalink()); ?>">
                        <?php echo esc_html(get_the_title()); ?>
                    </a>
                </h3>
                <p class="lab-level">
                    Level: <?php echo esc_html(get_post_meta(get_the_ID(), 'lab_level', true)); ?>
                </p>
                <p><?php echo esc_html(get_the_excerpt()); ?></p>
            </article>
        <?php endwhile; ?>
        <?php if (!$query->post_count) : ?>
            <p>No published notes yet.</p>
        <?php endif; ?>
    </div>
    <?php
    wp_reset_postdata();
    return (string) ob_get_clean();
}
add_shortcode('lab_notes', 'lab_notes_list_shortcode');

function lab_notes_search_shortcode(): string {
    $id = wp_unique_id('lab-search-');
    ob_start();
    ?>
    <section class="lab-search" data-lab-search>
        <h2>Search notes</h2>
        <form>
            <label for="<?php echo esc_attr($id); ?>">Search title or content</label>
            <input id="<?php echo esc_attr($id); ?>" name="search" type="search" maxlength="100">
            <button type="submit">Search</button>
        </form>
        <p role="status" data-lab-status>Submit an empty search to list recent notes.</p>
        <ul data-lab-results></ul>
        <noscript>Enable JavaScript for search, or browse the note links above.</noscript>
    </section>
    <?php
    return (string) ob_get_clean();
}
add_shortcode('lab_search', 'lab_notes_search_shortcode');

function lab_notes_content_banner(string $content): string {
    if (is_singular('lab_note') && in_the_loop() && is_main_query()) {
        $banner = get_option('lab_notes_banner', 'Practice one idea at a time.');
        $content .= '<p class="lab-banner">' . esc_html($banner) . '</p>';
    }
    return $content;
}
add_filter('the_content', 'lab_notes_content_banner');
```

**What it does:** registers notes/topics, exposes supported content to the block editor and REST API, loads assets, returns shortcode HTML, and adds a banner through a filter. The custom-fields support is needed for registered post meta in REST. `lab_level` is intentionally public metadata; keep private data out of publicly exposed fields.

`ob_start()` captures HTML into a string so the shortcode **returns** output. `wp_reset_postdata()` restores the main post after a secondary query. The query count is capped, and rewrite rules flush on lifecycle events instead of every request.

For this small lab, assets load on every frontend page so the Custom HTML exercise also works. In a larger site, load them only on the views that need them. Use `wp_enqueue_*` instead of manually inserting script/style tags. [Script loading](https://developer.wordpress.org/reference/functions/wp_enqueue_script/)

**Hooks to identify:** `init`, `wp_enqueue_scripts`, `the_content`, activation, and deactivation. An action callback performs work; a filter callback must return the resulting value.

## 7. Add a public REST endpoint

### File: `wp-content/plugins/lab-notes/includes/rest.php`

```php
<?php
defined('ABSPATH') || exit;

function lab_notes_register_routes(): void {
    register_rest_route('lab/v1', '/notes', [
        'methods' => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback' => 'lab_notes_rest_search',
        'args' => [
            'search' => [
                'type' => 'string',
                'default' => '',
                'maxLength' => 100,
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ],
    ]);
}
add_action('rest_api_init', 'lab_notes_register_routes');

function lab_notes_rest_search(WP_REST_Request $request): WP_REST_Response {
    $query = new WP_Query([
        'post_type' => 'lab_note',
        'post_status' => 'publish',
        'has_password' => false,
        'posts_per_page' => 10,
        's' => $request->get_param('search'),
        'orderby' => 'date',
        'order' => 'DESC',
        'no_found_rows' => true,
    ]);

    $items = [];
    foreach ($query->posts as $note) {
        $items[] = [
            'id' => $note->ID,
            'title' => html_entity_decode(
                wp_strip_all_tags(get_the_title($note->ID)),
                ENT_QUOTES,
                get_bloginfo('charset')
            ),
            'url' => get_permalink($note->ID),
            'level' => get_post_meta($note->ID, 'lab_level', true),
        ];
    }

    return rest_ensure_response($items);
}
```

**What it does:** provides a read-only JSON endpoint containing up to ten published, non-password-protected notes. `permission_callback` explicitly allows public reads. It never returns draft/private note rows. Search input has a declared type, length limit, and sanitizer.

This `foreach` does not call `the_post()`, so it does not change global post state. JSON values are data; the browser will insert titles using `textContent` instead of interpreting them as HTML.

After activation, try:

```bash
curl -sS 'http://wp-lab.test/wp-json/lab/v1/notes?search=PHP'
curl -sS 'http://wp-lab.test/wp-json/wp/v2/lab-notes?per_page=2'
```

The first URL is the custom route; the second is WordPress's built-in route for the registered post type. Empty arrays are valid until notes are published.

For authenticated mutations, use a real capability check in the permission callback. Cookie-authenticated REST writes also need a valid `wp_rest` nonce in `X-WP-Nonce`; remote application passwords belong over HTTPS. Public reads here need no nonce. [Custom endpoints](https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/)

**Try:** add a draft whose title contains your search term; verify it is absent from the custom response.

## 8. Save metadata safely

### File: `wp-content/plugins/lab-notes/includes/meta.php`

```php
<?php
defined('ABSPATH') || exit;

function lab_notes_clean_level($value): string {
    $value = is_string($value) ? sanitize_text_field($value) : '';
    return in_array($value, ['beginner', 'intermediate', 'advanced'], true)
        ? $value
        : 'beginner';
}

function lab_notes_can_edit_level($allowed, $meta_key, $post_id): bool {
    return current_user_can('edit_post', (int) $post_id);
}

function lab_notes_add_meta_box(): void {
    add_meta_box('lab-note-level', 'Note level', 'lab_notes_level_box', 'lab_note', 'side');
}
add_action('add_meta_boxes', 'lab_notes_add_meta_box');

function lab_notes_level_box(WP_Post $post): void {
    $level = get_post_meta($post->ID, 'lab_level', true);
    wp_nonce_field('lab_save_level_' . $post->ID, 'lab_level_nonce');
    ?>
    <p>
        <label for="lab-level">Difficulty</label>
        <select id="lab-level" name="lab_level">
            <?php foreach (['beginner', 'intermediate', 'advanced'] as $value) : ?>
                <option value="<?php echo esc_attr($value); ?>" <?php selected($level, $value); ?>>
                    <?php echo esc_html(ucfirst($value)); ?>
                </option>
            <?php endforeach; ?>
        </select>
    </p>
    <?php
}

function lab_notes_save_level(int $post_id): void {
    if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) {
        return;
    }

    if (!isset($_POST['lab_level_nonce']) || !is_string($_POST['lab_level_nonce'])) {
        return;
    }

    $nonce = sanitize_text_field(wp_unslash($_POST['lab_level_nonce']));
    if (!wp_verify_nonce($nonce, 'lab_save_level_' . $post_id)) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (!isset($_POST['lab_level']) || !is_string($_POST['lab_level'])) {
        return;
    }

    $level = sanitize_text_field(wp_unslash($_POST['lab_level']));
    if (!in_array($level, ['beginner', 'intermediate', 'advanced'], true)) {
        return;
    }

    update_post_meta($post_id, 'lab_level', $level);
}
add_action('save_post_lab_note', 'lab_notes_save_level');
```

**What it does:** adds a Note level field and saves an allowlisted value. Autosaves/revisions are skipped. The form nonce is specific to the post, and the permission check is independent of it. REST metadata writes use the registered schema and authorization callback from the main plugin.

**Input/output revision:**

| Step             | Purpose                                | Example                              |
| ---------------- | -------------------------------------- | ------------------------------------ |
| Check shape      | Reject unexpected arrays/objects       | `is_string($_POST['lab_level'])`     |
| Unslash          | Remove WordPress-added request slashes | `wp_unslash(...)`                    |
| Sanitize         | Normalize input                        | `sanitize_text_field(...)`           |
| Validate         | Accept only valid domain values        | `in_array(..., true)`                |
| Authorize        | Check the user's permission            | `current_user_can('edit_post', $id)` |
| Verify nonce     | Help protect the form against CSRF     | `wp_verify_nonce(...)`               |
| Escape at output | Match the HTML context                 | `esc_html`, `esc_attr`, `esc_url`    |

WordPress nonces expire and can be reused within their validity period. They provide CSRF protection in the relevant authenticated flow; they do not establish permission or identity. [Nonces](https://developer.wordpress.org/apis/security/nonces/) · [Sanitizing](https://developer.wordpress.org/apis/security/sanitizing/) · [Escaping](https://developer.wordpress.org/apis/security/escaping/)

**Check:** set a note to Advanced, save, reopen it, and verify both the select and shortcode display the level.

## 9. Add a settings page

### File: `wp-content/plugins/lab-notes/includes/settings.php`

```php
<?php
defined('ABSPATH') || exit;

function lab_notes_register_settings(): void {
    register_setting('lab_notes_options', 'lab_notes_banner', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => 'Practice one idea at a time.',
    ]);

    add_settings_section('lab_notes_display', 'Display', '__return_false', 'lab-notes');
    add_settings_field(
        'lab_notes_banner',
        'Note banner',
        'lab_notes_banner_field',
        'lab-notes',
        'lab_notes_display',
        ['label_for' => 'lab-notes-banner']
    );
}
add_action('admin_init', 'lab_notes_register_settings');

function lab_notes_settings_menu(): void {
    add_options_page('Notes Lab', 'Notes Lab', 'manage_options', 'lab-notes', 'lab_notes_settings_page');
}
add_action('admin_menu', 'lab_notes_settings_menu');

function lab_notes_banner_field(): void {
    $value = get_option('lab_notes_banner', 'Practice one idea at a time.');
    ?>
    <input id="lab-notes-banner" name="lab_notes_banner" type="text"
        class="regular-text" value="<?php echo esc_attr($value); ?>">
    <p class="description">Shown below individual published notes.</p>
    <?php
}

function lab_notes_settings_page(): void {
    if (!current_user_can('manage_options')) {
        return;
    }
    ?>
    <div class="wrap">
        <h1>Notes Lab</h1>
        <?php settings_errors(); ?>
        <form method="post" action="options.php">
            <?php
            settings_fields('lab_notes_options');
            do_settings_sections('lab-notes');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}
```

**What it does:** adds Settings → Notes Lab. The Settings API supplies the registered option flow, nonce fields, and authorization checks when posting to `options.php`; the callback sanitizes the banner. The content filter reads the option without a custom SQL query. [Settings API](https://developer.wordpress.org/plugins/settings/settings-api/)

**Check:** save a banner containing `<script>alert(1)</script>`. It must not execute when viewing a note. The stored value is text, and output is escaped.

## 10. Add browser JavaScript and CSS

### File: `wp-content/plugins/lab-notes/assets/lab.js`

```javascript
(() => {
  // Each counter has independent state; no state is saved to the server.
  document.querySelectorAll("[data-lab-counter]").forEach((counter) => {
    const output = counter.querySelector("[data-lab-value]");
    const increment = counter.querySelector("[data-lab-increment]");
    const reset = counter.querySelector("[data-lab-reset]");
    if (!output || !increment || !reset) return;

    let count = 0;
    increment.addEventListener("click", () => {
      count += 1;
      output.textContent = String(count);
    });
    reset.addEventListener("click", () => {
      count = 0;
      output.textContent = "0";
    });
  });

  document.querySelectorAll("[data-lab-search]").forEach((widget) => {
    const form = widget.querySelector("form");
    const input = widget.querySelector('input[name="search"]');
    const results = widget.querySelector("[data-lab-results]");
    const status = widget.querySelector("[data-lab-status]");
    if (!form || !input || !results || !status) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      if (button.disabled) return;

      results.replaceChildren();
      status.textContent = "Searching…";
      button.disabled = true;
      widget.setAttribute("aria-busy", "true");

      try {
        const endpoint = window.LabNotesConfig?.endpoint;
        if (!endpoint) throw new Error("Missing REST configuration.");

        const url = new URL(endpoint, window.location.origin);
        url.searchParams.set("search", input.value.trim());
        const response = await fetch(url, {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);

        const notes = await response.json();
        if (!Array.isArray(notes)) throw new Error("Unexpected response.");

        const fragment = document.createDocumentFragment();
        for (const note of notes) {
          const item = document.createElement("li");
          const link = document.createElement("a");
          const target = new URL(note.url, window.location.origin);
          if (!["http:", "https:"].includes(target.protocol)) continue;

          link.href = target.href;
          link.textContent = note.title;
          item.append(link, document.createTextNode(` — ${note.level}`));
          fragment.append(item);
        }
        const count = fragment.childElementCount;
        results.append(fragment);
        status.textContent = count
          ? `${count} note(s) found. Showing up to 10.`
          : "No matching notes.";
      } catch (error) {
        status.textContent =
          "Search failed. Check the browser console and REST URL.";
        console.error(error);
      } finally {
        button.disabled = false;
        widget.removeAttribute("aria-busy");
      }
    });
  });
})();
```

**What it does:** listens for DOM events, tracks counter state, fetches JSON, handles failures, and builds links with DOM methods. `textContent` prevents titles being interpreted as executable HTML. `URL.searchParams` encodes query input and preserves the endpoint's existing query parameters.

`defer` lets the script run after HTML parsing. Each widget finds its own controls so multiple widgets do not share state. Disabling the search button prevents overlapping requests, and `role="status"` announces updates.

### File: `wp-content/plugins/lab-notes/assets/lab.css`

```css
.lab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
  margin-block: 1rem 2rem;
}
.lab-card,
.lab-search,
.lab-counter,
.lab-hint {
  padding: 1rem;
  border: 1px solid #bcc9dd;
  border-radius: 0.6rem;
  background: #f8faff;
}
.lab-card h3 {
  margin-top: 0;
}
.lab-level {
  font-size: 0.9rem;
  color: #354766;
}
.lab-search form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}
.lab-search label {
  flex-basis: 100%;
}
.lab-search input {
  flex: 1 1 12rem;
  min-width: 0;
}
.lab-search input,
.lab-search button,
.lab-counter button {
  padding: 0.6rem 0.9rem;
  font: inherit;
}
.lab-search button,
.lab-counter button {
  background: #174ea6;
  color: white;
  border: 0;
  border-radius: 0.3rem;
  cursor: pointer;
}
.lab-search button:disabled {
  opacity: 0.65;
  cursor: wait;
}
.lab-search :focus-visible,
.lab-counter :focus-visible,
.lab-hint :focus-visible {
  outline: 3px solid #174ea6;
  outline-offset: 3px;
}
.lab-banner {
  padding: 0.75rem;
  border-left: 0.25rem solid #174ea6;
  background: #eef3ff;
}
.lab-hint summary {
  cursor: pointer;
  font-weight: 600;
}
```

**What it does:** creates a responsive card grid and styles only plugin classes. The nested `min()` prevents a card's minimum width overflowing a narrow container. Flex wrapping keeps search usable on small screens.

**Try:** change the accent color, then inspect the grid at a 320px viewport. Confirm that Tab focus remains visible.

## 11. Activate and try the project

Once every required file exists:

```bash
cd /var/www/wp-lab
wp plugin activate lab-notes
wp rewrite flush --hard
```

1. Open Lab Notes → Add New in the dashboard.
2. Publish three notes, such as “PHP arrays”, “WordPress hooks”, and “CSS grid”.
3. Add Topics and choose a Note level for each. Publish one additional draft to test visibility.
4. Create a page named **Practice**. Add two **Shortcode blocks**, one containing each line below:

```text
[lab_notes limit="4"]
[lab_search]
```

5. Publish the page and view it. Search for `PHP`; search for an absent term; submit an empty search.
6. Open a note permalink and the `/notes/` archive. Change the banner under Settings → Notes Lab.

**Expected:** cards show published notes and levels; search returns matching public notes; individual notes show the banner; draft content is absent from public search.

If you want Practice as the front page, choose it under Settings → Reading. Do not give the page the slug `notes`, because that slug belongs to the post type archive.

**Try:** switch to another installed theme. The plugin's post type and data remain available; the presentation changes.

## 12. Try custom HTML

On the Practice page, add a **Custom HTML block** and paste:

```html
<section class="lab-counter" data-lab-counter>
  <h2>Practice counter</h2>
  <p>Count completed attempts during this browser visit.</p>
  <button type="button" data-lab-increment>Add attempt</button>
  <button type="button" data-lab-reset>Reset</button>
  <p role="status">Attempts: <output data-lab-value>0</output></p>
</section>

<details class="lab-hint">
  <summary>Revision hint: action or filter?</summary>
  <p>An action runs work at an event. A filter returns a changed value.</p>
</details>
```

**What it does:** the semantic section contains real buttons; `data-*` attributes connect it to plugin JavaScript. `type="button"` prevents accidental form submission. `<details>` supplies an expandable hint without custom JavaScript.

**Check:** on the published frontend, Add attempt increments the output and Reset returns it to zero. Reloading resets it because the value is browser memory, not database state. The plugin's frontend script does not run in the editor's HTML preview.

**Try:** duplicate the counter and confirm the two counters are independent. Add a decrement button and prevent negative counts. Then persist a value with `localStorage` and compare browser-local persistence with server storage.

## 13. Add a dynamic editor block

This optional lab creates a real block using WordPress's supplied JavaScript packages. It needs no JSX compiler. A placeholder appears in the editor; PHP renders the published note list.

```bash
cd /var/www/wp-lab
mkdir -p wp-content/plugins/lab-notes/blocks/notes
```

### File: `wp-content/plugins/lab-notes/blocks/notes/block.json`

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "lab/notes",
  "version": "1.0.0",
  "title": "Lab Notes",
  "category": "widgets",
  "icon": "welcome-learn-more",
  "description": "Display a published notes list.",
  "attributes": {
    "limit": { "type": "number", "default": 3 }
  },
  "supports": { "html": false },
  "editorScript": "lab-notes-block-editor"
}
```

### File: `wp-content/plugins/lab-notes/blocks/notes/editor.js`

```javascript
(() => {
  const el = wp.element.createElement;
  const { Fragment } = wp.element;
  const { InspectorControls, useBlockProps } = wp.blockEditor;
  const { PanelBody, RangeControl } = wp.components;

  wp.blocks.registerBlockType("lab/notes", {
    apiVersion: 3,
    title: "Lab Notes",
    icon: "welcome-learn-more",
    category: "widgets",
    attributes: { limit: { type: "number", default: 3 } },
    supports: { html: false },
    edit({ attributes, setAttributes }) {
      const blockProps = useBlockProps();
      return el(
        Fragment,
        null,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: "List settings" },
            el(RangeControl, {
              label: "Number of notes",
              min: 1,
              max: 12,
              value: attributes.limit,
              onChange: (limit) => setAttributes({ limit: limit ?? 3 }),
            }),
          ),
        ),
        el(
          "p",
          blockProps,
          `Lab Notes: ${attributes.limit} note(s), rendered on the frontend.`,
        ),
      );
    },
    save() {
      return null;
    },
  });
})();
```

### File: `wp-content/plugins/lab-notes/includes/block.php`

```php
<?php
defined('ABSPATH') || exit;

function lab_notes_register_block(): void {
    $plugin_file = dirname(__DIR__) . '/lab-notes.php';
    $dir = dirname(__DIR__) . '/blocks/notes/';
    wp_register_script(
        'lab-notes-block-editor',
        plugins_url('blocks/notes/editor.js', $plugin_file),
        ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components'],
        (string) filemtime($dir . 'editor.js'),
        true
    );

    register_block_type($dir, ['render_callback' => 'lab_notes_render_block']);
}
add_action('init', 'lab_notes_register_block');

function lab_notes_render_block(array $attributes): string {
    $limit = $attributes['limit'] ?? 3;
    $wrapper = get_block_wrapper_attributes(['class' => 'lab-notes-block']);
    return '<div ' . $wrapper . '>'
        . lab_notes_list_shortcode(['limit' => $limit])
        . '</div>';
}
```

After those three files exist, append this line to `lab-notes.php`, inside its existing PHP context. Do not add another opening `<?php` tag:

```php
require_once __DIR__ . '/includes/block.php';
```

**What it does:** `block.json` declares the block contract. PHP registers the metadata and an editor script with WordPress dependencies. `save()` returns `null`, so content is generated by the render callback when viewed; attributes are stored with the block. `get_block_wrapper_attributes()` supplies WordPress block wrapper attributes.

The example repeats the basic metadata in the vanilla editor registration for readability. A larger build can import `block.json` to keep client registration in sync. WordPress provides React through `wp.element`; avoid bundling another React copy into this block. [Block metadata](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/) · [Registration](https://developer.wordpress.org/reference/functions/register_block_type/)

**Check:** reload the page editor, insert **Lab Notes**, adjust the range control, and publish. The frontend shows that many cards, subject to the number of published notes. Publish another note and refresh; dynamic content updates without resaving the page.

## 14. Use pnpm for frontend builds

The previous examples work without Node or a build. Use this optional section after completing the block lab. Commands run **in the VM** so generated assets already live in the site. You can also build on the laptop and copy the resulting assets to the VM.

### 14.1 Check/install the tools

```bash
node --version
pnpm --version
```

If both already work with a supported Node release, keep the existing installation. For a VM without pnpm, the official standalone installer can install it without first installing Node:

```bash
curl -fsSL https://get.pnpm.io/install.sh -o /tmp/install-pnpm.sh
less /tmp/install-pnpm.sh
sh /tmp/install-pnpm.sh
source ~/.bashrc
pnpm runtime set node 24 -g
node --version
pnpm --version
```

`pnpm runtime` is the current documented command for installing a Node runtime. Older standalone pnpm versions may use `pnpm env use --global 24`; that command is now deprecated. Frontend tools still need a Node runtime even when pnpm itself is a standalone executable. [pnpm installation](https://pnpm.io/installation) · [Runtime commands](https://pnpm.io/cli/runtime)

### 14.2 Add a small build

```bash
cd /var/www/wp-lab/wp-content/plugins/lab-notes
mkdir -p src
cp assets/lab.js src/lab.js
cp assets/lab.css src/lab.css
```

Create this file before installing dependencies:

### File: `wp-content/plugins/lab-notes/package.json`

```json
{
  "name": "lab-notes-assets",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build:js": "esbuild src/lab.js --bundle --minify --outfile=assets/lab.js",
    "build:css": "esbuild src/lab.css --minify --outfile=assets/lab.css",
    "build": "pnpm run build:js && pnpm run build:css",
    "check:js": "node --check src/lab.js && node --check blocks/notes/editor.js",
    "format": "prettier --write src blocks/notes/editor.js package.json"
  }
}
```

```bash
pnpm add -D esbuild prettier
pnpm run check:js
pnpm run build
```

If pnpm reports a blocked build script for esbuild, run `pnpm approve-builds`, select **esbuild**, and rerun the build. Only approve a dependency you intend to install. [Build approval command](https://pnpm.io/cli/approve-builds)

**What it does:** installs development tools, checks JS syntax, and creates compact browser assets. After this step, edit **`src/lab.js` and `src/lab.css`**, then rebuild; changes made directly to `assets/` will be overwritten. The PHP enqueue paths continue pointing to `assets/`.

Commit `package.json`, `pnpm-lock.yaml`, any pnpm approval configuration, source files, and built assets. Exclude `node_modules`. Reinstall the recorded dependency graph with:

```bash
pnpm install --frozen-lockfile
pnpm run build
```

Record the exact pnpm version from `pnpm --version` in a `packageManager` field if desired, for example `"packageManager": "pnpm@X.Y.Z"` with the real version substituted. The deployed PHP site serves built files and does not need a running Node process. [esbuild](https://esbuild.github.io/getting-started/)

**Try:** split a JS helper into `src/helpers.js`, import it from `src/lab.js`, and verify esbuild bundles it into the same frontend asset.

## 15. Database and query revision

### 15.1 Where data lives

WordPress normally uses **MySQL or MariaDB**, rather than PostgreSQL. The configured prefix can differ from `wp_`.

| Table/API                                               | Stores or handles                                           |
| ------------------------------------------------------- | ----------------------------------------------------------- |
| `wp_posts`                                              | Posts, pages, custom post types, attachments, and revisions |
| `wp_postmeta`                                           | Extra fields associated with post IDs                       |
| `wp_terms`, `wp_term_taxonomy`, `wp_term_relationships` | Terms, taxonomy definitions, and content associations       |
| `wp_options`                                            | Site options, including the banner                          |
| `WP_Query`                                              | Query posts while using WordPress behavior/hooks            |
| `get_post_meta` / `update_post_meta`                    | Read/write one post's extra fields                          |
| `get_option` / `update_option`                          | Read/write site settings                                    |
| `get_transient` / `set_transient`                       | Expiring cached values; expiry is a maximum lifetime        |

Inspect values from the project directory, substituting an actual note ID:

```bash
cd /var/www/wp-lab
wp post list --post_type=lab_note --fields=ID,post_title,post_status
wp post meta get 123 lab_level
wp option get lab_notes_banner
wp db tables
```

### 15.2 Safe direct SQL exercise

Prefer WordPress content APIs for normal operations. For SQL revision, create **`~/wp-lab-php/query.php`**:

```php
<?php
global $wpdb;

$sql = $wpdb->prepare(
    "SELECT ID, post_title FROM {$wpdb->posts}
     WHERE post_type = %s AND post_status = %s
     ORDER BY ID DESC LIMIT %d",
    'lab_note',
    'publish',
    5
);

$rows = $wpdb->get_results($sql);
foreach ($rows as $row) {
    echo $row->ID . ': ' . $row->post_title . PHP_EOL;
}
```

Run with WordPress loaded:

```bash
cd /var/www/wp-lab
wp eval-file ~/wp-lab-php/query.php
```

**What it does:** returns five published notes using value placeholders. `%s` represents a string and `%d` an integer. The table identifier comes from trusted `$wpdb->posts`, which uses the configured prefix. Do not concatenate request input into SQL, including dynamic identifiers. This exercise prints to the CLI; escape data separately when rendering HTML. [wpdb::prepare](https://developer.wordpress.org/reference/classes/wpdb/prepare/)

### 15.3 Change the shortcode query

To filter the shortcode to a topic with slug `php`, add this entry to its `WP_Query` arguments:

```php
'tax_query' => [
    [
        'taxonomy' => 'lab_topic',
        'field' => 'slug',
        'terms' => 'php',
    ],
],
```

**What it does:** limits results through the registered taxonomy. Create the PHP topic and assign notes before testing. This fragment belongs inside the query argument array; it is not a standalone PHP file.

To sort by title, change `orderby` to `title` and `order` to `ASC`. To show only advanced notes, add `meta_key => 'lab_level'` and `meta_value => 'advanced'`. Metadata filtering is useful but can become expensive at scale; measure actual queries before designing large datasets around it.

## 16. Debugging and verification

### 16.1 Useful commands

```bash
cd /var/www/wp-lab

# Syntax-check every custom PHP file. No database actions are executed.
find wp-content/themes/lab-theme wp-content/plugins/lab-notes \
  -type f -name '*.php' -not -path '*/node_modules/*' -print0 \
  | xargs -0 -r -n1 php -l

# After Node is installed, syntax-check browser scripts.
node --check wp-content/plugins/lab-notes/assets/lab.js

# Check installation and registration.
wp core verify-checksums
wp plugin list
wp theme list
wp post-type list --fields=name,label,public

# Logs can contain request data; keep them out of the repository.
sudo tail -n 50 /var/log/wp-lab/debug.log
sudo tail -n 50 /var/log/apache2/wp-lab-error.log
```

The debug log appears after PHP writes its first message; a missing file before then can be normal. Syntax checks do not prove WordPress hook behavior or browser interactions; also perform the manual checks below in the actual VM.

Use browser DevTools → Console for JS errors and Network for REST status/response bodies. Use Elements to inspect whether styles and selectors match the generated DOM. Add a temporary `error_log('lab: reached callback');` inside a callback to trace execution, then remove it.

### 16.2 Common problems

| Symptom                                | Check/fix                                                                                            |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Laptop cannot reach the site           | VM is running, host-only IP is correct, laptop hosts entry exists, firewall permits the subnet       |
| Apache serves the default page         | `a2ensite`, `a2dissite`, `apache2ctl -S`, and matching `ServerName`                                  |
| Error establishing database connection | MariaDB service; account/password/database; `DB_HOST=localhost`                                      |
| Page or `/wp-json/` is 404             | Enable `rewrite`; allow `FileInfo`; run `wp rewrite flush --hard`; check `.htaccess`                 |
| Plugin activation fails                | All included files exist; PHP syntax/version is correct                                              |
| White page or critical error           | Read the PHP/Apache logs; deactivate the plugin with `wp plugin deactivate lab-notes --skip-plugins` |
| CSS/JS does not load                   | Correct asset paths; active plugin/theme; `wp_head()` and `wp_footer()` are present                  |
| Change is not visible                  | Rebuild if using `src/`; hard-refresh; inspect asset URL/version; check caching                      |
| Search returns HTML instead of JSON    | Wrong URL, redirect, rewrite failure, or PHP warning output                                          |
| Metadata is not saved                  | Save/publish the note; check nonce, capability, field name, and allowlist                            |
| Dashboard asks for FTP credentials     | Use WP-CLI; PHP deliberately lacks write access to code directories                                  |

For a permalink diagnostic, the REST query form bypasses pretty-URL rewrites:

```bash
curl -sS 'http://wp-lab.test/?rest_route=/lab/v1/notes&search=PHP'
```

### 16.3 Manual verification checklist

- [ ] PHP syntax checks pass for every custom file.
- [ ] Home, Practice, note permalinks, and the notes archive load.
- [ ] CSS and JS return HTTP 200 in DevTools.
- [ ] A level persists after saving and reopening a note.
- [ ] Changing Settings → Notes Lab changes the singular-note banner.
- [ ] Public search returns published, non-password-protected notes, excluding drafts/private notes.
- [ ] Empty search, no results, and failed requests show understandable status messages.
- [ ] Two search widgets and two counters operate independently.
- [ ] Buttons, labels, focus indicators, and expandable hints work with the keyboard.
- [ ] The page has no horizontal overflow at a 320px viewport.
- [ ] If the block lab is complete, its count setting changes the frontend list.
- [ ] A subscriber account cannot edit notes or access the settings page.
- [ ] Logs contain no unexpected warnings after exercising the site.

## 17. Keep custom work in Git

Save this document as `wordpress-php-revision.md` in `/var/www/wp-lab` if you want the guide and exercises in one repository. The following ignore file tracks only the custom theme/plugin, selected Markdown files, and the credential-free WP-CLI configuration, leaving WordPress core, private configuration, uploads, and other installed plugins/themes outside Git.

### File: `.gitignore` at `/var/www/wp-lab`

```gitignore
# Ignore everything at the project root, then allow selected source paths.
/*
!/.gitignore
!/README.md
!/wordpress-php-revision.md
!/wp-cli.yml
!/wp-content/

/wp-content/*
!/wp-content/themes/
!/wp-content/plugins/

/wp-content/themes/*
!/wp-content/themes/lab-theme/
/wp-content/plugins/*
!/wp-content/plugins/lab-notes/

# Exclude generated dependencies, credentials, logs, and database exports.
**/node_modules/
**/vendor/
**/.env
**/.env.*
**/wp-config.php
**/*.log
**/*.sql
**/*.sql.gz
**/*.sqlite
**/*.sqlite3
**/*~
```

Initialize and inspect:

```bash
cd /var/www/wp-lab
git init
git add .gitignore wordpress-php-revision.md wp-cli.yml \
  wp-content/themes/lab-theme wp-content/plugins/lab-notes
git status --short
git diff --cached
git check-ignore wp-config.php wp-content/uploads/example.png
```

**What it does:** stages the learning document and custom source. Review the staged content before committing. `.gitignore` does not remove files already tracked; if necessary, use `git rm --cached wp-config.php` to untrack a file while keeping its local copy. Apache's earlier Git directory rule prevents serving Git metadata over HTTP.

If publishing anonymously, check Git commit author metadata separately; GitHub supports a `noreply` address for commits. This document supplies no real author identity or credentials.

### 17.1 Backup before experiments

```bash
cd /var/www/wp-lab
mkdir -p ~/wp-lab-backups
chmod 700 ~/wp-lab-backups
wp db export ~/wp-lab-backups/lab-before-experiment.sql
chmod 600 ~/wp-lab-backups/lab-before-experiment.sql
```

**What it does:** exports database state outside the web root and repository. A database backup does not contain uploads or custom source; retain those separately and keep a VM snapshot when useful. Database exports can contain site data and password hashes, so they are not public learning artifacts.

## 18. Practice challenges and revision checklist

### 18.1 Small challenges

| Challenge                                  | Practice                                     | How to verify                                                                  |
| ------------------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------ |
| Add a `topic` shortcode attribute          | Attribute defaults, taxonomy queries         | PHP topic shows only its assigned notes                                        |
| Add a duration field                       | Integer validation, metadata                 | Values outside 1–240 are rejected                                              |
| Add a level REST query parameter           | Argument schema, allowlisting, query filters | Invalid levels return a 400 response                                           |
| Build `archive-lab_note.php`               | Template hierarchy and the Loop              | Only the notes archive changes                                                 |
| Add pagination to a secondary query        | `paged`, counts, URL state                   | Page two shows distinct results; remove `no_found_rows` when totals are needed |
| Add an editor preview to the dynamic block | ServerSideRender or authenticated fetching   | Editor previews real list output                                               |
| Register frontend assets conditionally     | Enqueue hooks and content inspection         | Assets load on Practice; counters still work where placed                      |
| Add text translations                      | Text domains and `__`, `_e`, `esc_html__`    | Labels can be translated using the plugin domain                               |
| Add a ten-minute transient cache           | Cache keys and invalidation                  | Different searches have distinct keys; edits invalidate stale results          |
| Rebuild the layout as a block theme        | `theme.json`, HTML templates, site editor    | The plugin works with the new theme                                            |

When caching, account for query parameters and visibility; do not cache private responses under a public key. When adding writes, require capabilities and the relevant CSRF/authentication flow.

### 18.2 Explain these without looking

- [ ] Why does a post type belong in a plugin?
- [ ] How does PHP output reach the browser, and when does JavaScript run?
- [ ] What changes between an action and a filter callback?
- [ ] Why must a shortcode return its output?
- [ ] When should `wp_reset_postdata()` run?
- [ ] How do a taxonomy, post meta, and an option differ?
- [ ] Why are validation, sanitization, escaping, permissions, and nonces separate steps?
- [ ] Which escaping function matches text, an HTML attribute, and a URL?
- [ ] Why does `textContent` suit a search result title?
- [ ] Why does the public REST endpoint explicitly select published content?
- [ ] Why should rewrite rules not flush on every `init`?
- [ ] How does a dynamic block differ from saved static block HTML?
- [ ] What does pnpm manage, and what does the PHP server need at runtime?
- [ ] Which files and database contents must stay out of a public repository?

## 19. Official references

Setup and tooling:

- [WordPress requirements](https://wordpress.org/about/requirements/)
- [Ubuntu WordPress setup](https://ubuntu.com/tutorials/install-and-configure-wordpress) — useful Apache/database background; its older version examples differ from this lab.
- [WP-CLI installation](https://make.wordpress.org/cli/handbook/guides/installing/)
- [WP-CLI commands](https://developer.wordpress.org/cli/commands/)
- [PHP manual](https://www.php.net/manual/en/)
- [pnpm installation](https://pnpm.io/installation)
- [pnpm runtime](https://pnpm.io/cli/runtime)
- [pnpm build approvals](https://pnpm.io/cli/approve-builds)
- [esbuild getting started](https://esbuild.github.io/getting-started/)

WordPress development:

- [Plugin handbook](https://developer.wordpress.org/plugins/)
- [Classic template hierarchy](https://developer.wordpress.org/themes/classic-themes/basics/template-hierarchy/)
- [Block theme structure](https://developer.wordpress.org/themes/core-concepts/theme-structure/)
- [Hooks](https://developer.wordpress.org/plugins/hooks/)
- [WP_Query](https://developer.wordpress.org/reference/classes/wp_query/)
- [Post metadata registration](https://developer.wordpress.org/reference/functions/register_post_meta/)
- [Settings API](https://developer.wordpress.org/plugins/settings/settings-api/)
- [Nonces](https://developer.wordpress.org/apis/security/nonces/)
- [Sanitizing input](https://developer.wordpress.org/apis/security/sanitizing/)
- [Escaping output](https://developer.wordpress.org/apis/security/escaping/)
- [Custom REST endpoints](https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/)
- [REST cookie authentication](https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/)
- [Block metadata](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/)
- [wpdb::prepare](https://developer.wordpress.org/reference/classes/wpdb/prepare/)

Baseline and API references reviewed on **2026-10-01**. Check official requirements and package/runtime documentation when revisiting the lab after major upgrades.
