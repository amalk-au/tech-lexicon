# Managing Applications on Ubuntu

A practical guide to keeping track of DEB packages, Snaps and AppImages without relying on the Software Centre.

This document contains generic examples, not an inventory of a particular computer. Commands are intended for a Bash terminal on Ubuntu. Replace `PACKAGE_NAME`, `SNAP_NAME` and `Example.AppImage` with the actual names before running them.

## 1. Use a simple system

| Software format | Inventory and management                                     | Update method                                                                    |
| --------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| DEB / APT       | Synaptic or APT; installed packages are registered with dpkg | APT, when a suitable repository supplies updates                                 |
| Snap            | `snap list` and other Snap commands                          | Automatic refreshes, or `sudo snap refresh`                                      |
| AppImage        | Keep files in `~/Applications`; optionally use Gear Lever    | The app's updater, a supported update tool, or a new download from the publisher |

Use one installation method per application unless there is a reason to keep multiple copies. Record the source and update method when adding an app.

APT tracks packages, including libraries and system components. A long installed-package list is normal; unfamiliar names alone are not a reason to remove anything.

## 2. Take an inventory

These commands inspect software without installing or removing it:

| Task                                                            | Command                                                        |
| --------------------------------------------------------------- | -------------------------------------------------------------- |
| List installed DEB packages                                     | `apt list --installed`                                         |
| List packages marked as manually installed                      | `apt-mark showmanual`                                          |
| Read a DEB package description                                  | `apt show PACKAGE_NAME`                                        |
| Inspect installed/candidate versions and configured APT sources | `apt policy PACKAGE_NAME`                                      |
| List installed Snaps                                            | `snap list`                                                    |
| Inspect a Snap's publisher and channels                         | `snap info SNAP_NAME`                                          |
| Inspect a Snap's interface connections                          | `snap connections SNAP_NAME`                                   |
| List AppImages in the standard folder                           | `find "$HOME/Applications" -type f -iname '*.AppImage' -print` |

`apt-mark showmanual` reflects package-management flags, not a complete history of personal choices. It may include packages supplied with Ubuntu or installed by scripts. Use it as a review aid, not as an automatic removal list.

To find AppImages scattered around the home directory:

```bash
find "$HOME" -type f -iname '*.AppImage' -print 2>/dev/null
```

This search can take time. It includes old downloads and unused copies, misses renamed files and files outside the home directory, and hides access errors. AppImages do not have a universal installed-app database.

Applications installed through Flatpak, language package managers, custom scripts or source builds need separate tracking. No command above is a complete inventory of every executable on the computer.

References: [APT manual](https://manpages.ubuntu.com/manpages/noble/man8/apt.8.html), [apt-mark manual](https://manpages.ubuntu.com/manpages/noble/man8/apt-mark.8.html), [Snap guide](https://snapcraft.io/docs/tutorials/get-started/).

## 3. Manage DEB packages with Synaptic and APT

### Install Synaptic

[Synaptic](https://manpages.ubuntu.com/manpages/noble/man8/synaptic.8.html) provides a graphical interface for APT package management.

```bash
sudo apt update
sudo apt install synaptic
```

Open **Synaptic Package Manager** from the application launcher, then select **Status → Installed**. Search for packages, read their descriptions and review proposed changes before applying them. Synaptic manages DEB packages; use the separate workflows below for Snaps and AppImages.

### Install and update packages

Install from the configured repositories:

```bash
sudo apt update
sudo apt install PACKAGE_NAME
```

Install a trusted downloaded DEB from its containing directory:

```bash
sudo apt install ./example-package.deb
```

The `./` identifies a local file. APT can resolve dependencies from configured repositories. A successfully installed downloaded DEB appears in the same package inventory as other DEB packages.

**Registration does not guarantee future updates.** Check whether the publisher configures a suitable repository or provides another update method, and record it in the app register. Prefer Ubuntu repositories or the publisher's documented installation method; adding a third-party repository is a separate trust decision.

For routine updates:

```bash
sudo apt update
apt list --upgradable
sudo apt upgrade
```

`update` refreshes package information; `upgrade` installs available package updates. Review the proposed changes. These commands do not upgrade Ubuntu to a new release. Follow Ubuntu's restart prompt when updates require a reboot.

### Remove packages deliberately

Back up important application data first. Preview the proposed removal:

```bash
sudo apt-get --simulate remove PACKAGE_NAME
```

If the proposal is appropriate, remove the package:

```bash
sudo apt remove PACKAGE_NAME
```

`remove` normally retains package configuration files. `purge` also removes package-managed configuration, but does not generally clear settings in the home directory. Removal can affect dependent packages and services; read the summary before confirming.

To review dependencies that APT considers unnecessary:

```bash
sudo apt-get --simulate autoremove
```

After reviewing the list, run `sudo apt autoremove` only if every proposed removal is acceptable. Avoid bulk cleanup commands that bypass review.

References: [Ubuntu package management](https://ubuntu.com/server/docs/how-to/software/package-management/), [APT manual](https://manpages.ubuntu.com/manpages/noble/man8/apt.8.html), [apt-get manual](https://manpages.ubuntu.com/manpages/noble/man8/apt-get.8.html).

## 4. Manage Snaps

List and inspect:

```bash
snap list
snap info SNAP_NAME
snap connections SNAP_NAME
```

`snap list` also includes supporting components, such as base and content snaps. Do not assume every entry is a standalone app or an unwanted duplicate.

Install an app from the Snap Store:

```bash
sudo snap install SNAP_NAME
```

Snaps normally update automatically. Check the refresh schedule and pending updates:

```bash
snap refresh --time
snap refresh --list
```

To request updates manually:

```bash
sudo snap refresh
```

If an update is postponed because an app is running, save work, close the app and try again.

To remove a Snap:

```bash
sudo snap remove SNAP_NAME
```

Removal affects the Snap's internal data. On standard Ubuntu systems, snapd normally creates a removal snapshot retained for 31 days. The `--purge` option skips creating that snapshot. Back up important data independently before removal.

References: [Snap guide](https://snapcraft.io/docs/tutorials/get-started/), [Managing Snap updates](https://snapcraft.io/docs/how-to-guides/manage-snaps/manage-updates/).

## 5. Keep AppImages organised

Create a consistent location:

```bash
mkdir -p "$HOME/Applications"
```

Move each trusted AppImage there before creating menu shortcuts. For example:

```bash
mv -- "$HOME/Downloads/Example.AppImage" "$HOME/Applications/"
chmod u+x "$HOME/Applications/Example.AppImage"
"$HOME/Applications/Example.AppImage"
```

Check that a file with the same name is not already present before moving it. Executable permission allows the file to run; it does not establish that the software is trustworthy. Launch ordinary AppImages as a normal user.

### Updates and shortcuts

- Record the official download page and update method in the app register.
- Use a built-in updater or supported update tool when available; otherwise download a new release from the publisher.
- Close the app before replacing its file, then verify the replacement launches correctly.
- Check menu shortcuts after changing the filename or location.

[Gear Lever](https://github.com/mijorus/gearlever) is an optional GUI for organising AppImages, creating menu entries and managing supported updates. Its standard distribution uses Flatpak, which adds another format to maintain. A folder and register are sufficient for a small collection.

### Removal

Close the application and move its AppImage file to the Trash. Remove any associated menu shortcut, or use the integration tool that created it. Deleting the executable does not necessarily remove application settings or data; inspect those separately before deleting them.

References: [AppImage FAQ](https://docs.appimage.org/user-guide/faq.html), [Running AppImages](https://docs.appimage.org/user-guide/run-appimages.html), [Gear Lever project](https://github.com/mijorus/gearlever).

## 6. Maintain a short app register

Track intentionally chosen applications rather than every system dependency. Copy and adapt this template; its rows are placeholders, not installed software:

| Application          | Format / identifier           | Source                        | Update method                        | Purpose                   |
| -------------------- | ----------------------------- | ----------------------------- | ------------------------------------ | ------------------------- |
| Example CLI tool     | DEB / `PACKAGE_NAME`          | Ubuntu repositories           | APT                                  | Describe why it is needed |
| Example desktop app  | Snap / `SNAP_NAME`            | Snap Store publisher          | Snap refresh                         | Describe why it is needed |
| Example portable app | AppImage / `Example.AppImage` | Official public download page | Publisher updater or manual download | Describe why it is needed |

Keep sensitive installation notes, private repositories and licence information in a separate private record. A public register can contain a deliberately selected list of public tools and generic setup instructions.

## 7. Export a private inventory

The following block writes inventory files under `~/.local/state/app-inventory`, outside a typical repository checkout. It does not install or remove packages. Running it again replaces the previous exports.

```bash
inventory_dir="$HOME/.local/state/app-inventory"
mkdir -p "$inventory_dir"

dpkg-query -W -f='${db:Status-Status}\t${binary:Package}\t${Version}\n' \
  | awk -F '\t' '$1 == "installed" { print $2 "\t" $3 }' \
  | sort > "$inventory_dir/deb-installed.tsv"

apt-mark showmanual | sort > "$inventory_dir/apt-manual.txt"

if command -v snap >/dev/null 2>&1; then
  snap list > "$inventory_dir/snaps.txt"
fi

if [ -d "$HOME/Applications" ]; then
  find "$HOME/Applications" -type f -iname '*.AppImage' -print \
    | sort > "$inventory_dir/appimages.txt"
fi
```

The DEB export filters for installed packages, excluding entries that only retain configuration. These inventories help with review and rebuilding; they do not back up documents, databases, settings, secrets or AppImage binaries. Do not blindly reinstall an entire export onto a different Ubuntu release.

Keep raw exports private. Paths can expose usernames and project names, and package lists can disclose private tools. Publish the guide and a sanitised register only after reviewing their contents. Never commit credentials, tokens, licence keys or unredacted diagnostic logs.

Reference: [dpkg-query manual](https://manpages.ubuntu.com/manpages/noble/man1/dpkg-query.1.html).

## 8. A manageable routine

- **When installing:** choose one format, note the source and update method, and add a register entry.
- **During the week:** allow security updates and Snap refreshes to run; restart when required.
- **Periodically:** check AppImage updates, review duplicates and remove applications no longer needed.
- **After changes:** update the register and refresh the private inventory.
- **Before major changes:** back up important data and review removal proposals.

For temporary experiments, use a disposable VM when appropriate and keep the host's application list focused on software used regularly.
