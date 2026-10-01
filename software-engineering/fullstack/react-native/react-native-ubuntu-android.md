# React Native on Ubuntu: from setup to an Android APK

A practical revision guide using **Ubuntu, Bash, pnpm, and the React Native Community CLI**. Build a small native task-list app, develop on a phone, then install a signed APK that works without the development server.

**Documentation checked:** 2026-10-01. This guide targets Ubuntu 22.04/24.04 on an x86_64 computer. Tool versions change: use the requirements in the generated project and the linked official documentation. The code and commands have been reviewed; this document does not claim a completed Android build or a physical-device test.

## Contents

- [React Native on Ubuntu: from setup to an Android APK](#react-native-on-ubuntu-from-setup-to-an-android-apk)
  - [Contents](#contents)
  - [1. Understand the tools](#1-understand-the-tools)
    - [What carries over from React web?](#what-carries-over-from-react-web)
  - [2. Install Ubuntu dependencies](#2-install-ubuntu-dependencies)
  - [3. Set up Node and pnpm](#3-set-up-node-and-pnpm)
    - [Install Node with nvm](#install-node-with-nvm)
    - [Install pnpm if needed](#install-pnpm-if-needed)
  - [4. Install Android Studio and configure paths](#4-install-android-studio-and-configure-paths)
    - [Install Android Studio](#install-android-studio)
    - [Set paths in Bash](#set-paths-in-bash)
  - [5. Create the React Native project](#5-create-the-react-native-project)
    - [Configure pnpm before installing](#configure-pnpm-before-installing)
    - [Record versions for revision](#record-versions-for-revision)
    - [Important files](#important-files)
  - [6. Install the SDK versions your project needs](#6-install-the-sdk-versions-your-project-needs)
  - [7. Prepare a phone or emulator](#7-prepare-a-phone-or-emulator)
    - [Option A: physical Android phone](#option-a-physical-android-phone)
    - [Option B: Android emulator](#option-b-android-emulator)
  - [8. Run the app during development](#8-run-the-app-during-development)
  - [9. Try the sample app](#9-try-the-sample-app)
    - [What the code does](#what-the-code-does)
    - [Small exercises](#small-exercises)
  - [10. Build a standalone signed APK](#10-build-a-standalone-signed-apk)
    - [A. Generate a private signing key once](#a-generate-a-private-signing-key-once)
    - [B. Keep the password outside Git](#b-keep-the-password-outside-git)
    - [C. Configure the release signing block](#c-configure-the-release-signing-block)
    - [D. Build the APK](#d-build-the-apk)
  - [11. Transfer and install the APK](#11-transfer-and-install-the-apk)
    - [Method A: install directly over USB with ADB](#method-a-install-directly-over-usb-with-adb)
    - [Method B: copy the APK, then tap to install](#method-b-copy-the-apk-then-tap-to-install)
  - [12. Test it on the phone](#12-test-it-on-the-phone)
    - [Inspect a crash](#inspect-a-crash)
  - [13. Make changes and rebuild](#13-make-changes-and-rebuild)
  - [14. Troubleshooting](#14-troubleshooting)
  - [15. Keep the project in GitHub](#15-keep-the-project-in-github)
  - [16. Revision cheat sheet](#16-revision-cheat-sheet)

## 1. Understand the tools

| Tool                               | What it does                                                          |
| ---------------------------------- | --------------------------------------------------------------------- |
| Node.js                            | Runs JavaScript development tools on the computer.                    |
| pnpm                               | Installs packages and runs project scripts.                           |
| React Native                       | Uses React components to create native mobile UI.                     |
| Metro                              | Serves and bundles JavaScript during development.                     |
| JDK 17                             | Supplies Java tools used by the Android build.                        |
| Android Studio / SDK               | Installs Android platforms, build tools, and optional emulators.      |
| Gradle wrapper (`android/gradlew`) | Runs the project's chosen Gradle version and builds Android binaries. |
| ADB                                | Connects to Android devices, installs APKs, and reads logs.           |
| Keystore                           | Holds the private key used to sign an installable app.                |

### What carries over from React web?

Components, props, hooks, state, JavaScript logic, and many API clients carry over. UI elements and styling change:

| React web                | React Native                                  |
| ------------------------ | --------------------------------------------- |
| `<div>`                  | `<View>`                                      |
| `<p>` / `<span>`         | `<Text>`; visible text belongs inside `Text`  |
| `<button onClick={...}>` | `<Pressable onPress={...}>` containing `Text` |
| `<input onChange={...}>` | `<TextInput onChangeText={...}>`              |
| CSS files / `className`  | `style` objects and `StyleSheet.create()`     |
| `localStorage`           | A mobile storage library or database          |
| Browser page / DOM       | Native Android views; there is no browser DOM |

Use a **separate mobile project**. Copy reusable logic from a web project, then adapt its UI. This guide produces an Android app, rather than a browser project. The default mobile template also has iOS files; local iOS builds require macOS.

## 2. Install Ubuntu dependencies

Run these commands on the Ubuntu computer:

```bash
sudo apt update
sudo apt install -y openjdk-17-jdk git curl unzip zip build-essential
```

These install the Java compiler, Git, download/archive tools, and common compilation tools. React Native's [environment guide](https://reactnative.dev/docs/set-up-your-environment) recommends JDK 17.

Check Java:

```bash
java -version
javac -version
```

Installing JDK 17 does not necessarily make it the default if other JDKs are installed. The `JAVA_HOME` setting below selects it for terminal builds.

## 3. Set up Node and pnpm

Use **Node 24 LTS** for this walkthrough. Current React Native documentation requires Node 22.11.0 or newer; Node 24 also supports modern pnpm versions. See [Node downloads](https://nodejs.org/en/download) and [pnpm compatibility](https://pnpm.io/installation#compatibility).

If suitable Node and pnpm versions are already installed, keep them and skip their installers.

### Install Node with nvm

If nvm is absent, use the versioned installer from its [official installation instructions](https://github.com/nvm-sh/nvm#installing-and-updating):

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh \
  -o /tmp/nvm-install.sh
bash /tmp/nvm-install.sh
source "$HOME/.bashrc"
```

nvm installs Node per user and lets different projects use different Node versions.

```bash
nvm install 24
nvm use 24
node --version
```

### Install pnpm if needed

Use the [official standalone installer](https://pnpm.io/installation), then reload Bash:

```bash
curl -fsSL https://get.pnpm.io/install.sh -o /tmp/pnpm-install.sh
sh /tmp/pnpm-install.sh
source "$HOME/.bashrc"
pnpm --version
```

Use an up-to-date pnpm release for the YAML configuration and build-approval commands in this guide; the installer above supplies the current release. Do not run pnpm or project builds with `sudo`.

## 4. Install Android Studio and configure paths

### Install Android Studio

1. Download the stable Linux `.tar.gz` from [Android Studio](https://developer.android.com/studio).
2. For the commands below, save or rename the downloaded archive to `android-studio-linux.tar.gz` in `Downloads`.
3. Extract and launch it:

```bash
mkdir -p "$HOME/tools"
tar -xzf "$HOME/Downloads/android-studio-linux.tar.gz" -C "$HOME/tools"
"$HOME/tools/android-studio/bin/studio"
```

If that archive has `studio.sh` instead of `studio`, run `"$HOME/tools/android-studio/bin/studio.sh"`. See the [Linux installation guide](https://developer.android.com/studio/install#linux) for distribution-specific library requirements.

4. Complete the setup wizard and allow it to install the Android SDK.
5. Open **More Actions → SDK Manager**, or **Settings → Languages & Frameworks → Android SDK** in an open project.
6. Note the SDK location. The usual Linux path is `$HOME/Android/Sdk`.
7. In **SDK Tools**, install **Android SDK Platform-Tools** and **Android SDK Command-line Tools (latest)**. Install **Android Emulator** only if you want an emulator.

Android Studio manages the native tools. You can write the application code in any editor.

### Set paths in Bash

Open `~/.bashrc` in an editor and add these lines once. Change `ANDROID_HOME` if SDK Manager shows a different location:

```bash
export JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
```

`JAVA_HOME` selects Java; `ANDROID_HOME` locates the SDK; `PATH` makes its commands available. These paths target x86_64 Ubuntu. Avoid conflicting `ANDROID_HOME` and `ANDROID_SDK_ROOT` values if both already exist.

```bash
source "$HOME/.bashrc"
java -version
adb version
sdkmanager --version
```

Android Studio can use its own Gradle JDK. If building there, select JDK 17 in its **Gradle JDK** settings to match terminal builds.

## 5. Create the React Native project

Run this from the directory where you want to keep practice projects:

```bash
mkdir -p "$HOME/projects"
cd "$HOME/projects"
pnpm dlx @react-native-community/cli@latest init NativePractice \
  --skip-install \
  --skip-git-init true
cd NativePractice
```

`pnpm dlx` runs the generator without installing a global CLI. `--skip-install` lets you configure pnpm before installing dependencies. `--skip-git-init true` leaves Git initialization for later. If prompted about CocoaPods, skip it for this Android walkthrough. See the [CLI initialization options](https://github.com/react-native-community/cli/blob/main/docs/commands.md#init).

The command selects the stable React Native release available when you run it. For an intentional version choice, the generator also supports `--version <exact-react-native-version>`; match the Community CLI to that release's compatibility requirements.

### Configure pnpm before installing

Create **`pnpm-workspace.yaml`** in the project root:

```yaml
packages:
  - "."

nodeLinker: hoisted
```

This walkthrough chooses a flat `node_modules` layout to simplify native tooling's package paths. It is a compatibility choice, rather than a claim that React Native always requires hoisting. See [pnpm's nodeLinker settings](https://pnpm.io/settings/node-modules#nodelinker).

```bash
pnpm install
```

If pnpm reports blocked dependency build scripts, inspect the named packages and approve the scripts needed by your dependencies:

```bash
pnpm approve-builds
pnpm install
```

The first command records your package-specific choices. It does not grant blanket approval to every dependency. See [pnpm approve-builds](https://pnpm.io/cli/approve-builds).

### Record versions for revision

Save the exact Node version:

```bash
node --version > .nvmrc
```

Record the installed pnpm version in `package.json`:

```bash
node <<'NODE'
const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = execFileSync('pnpm', ['--version'], {encoding: 'utf8'}).trim();
pkg.packageManager = `pnpm@${version}`;
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
NODE
```

Commit `package.json`, `.nvmrc`, and `pnpm-lock.yaml`. To reproduce this app later, clone its repository and run `nvm install`, `nvm use`, and `pnpm install --frozen-lockfile` using the recorded pnpm version; there is no need to generate a new project.

### Important files

| Path                       | Purpose                                                      |
| -------------------------- | ------------------------------------------------------------ |
| `App.tsx`                  | The screen you will replace with the sample below.           |
| `index.js`                 | Registers the React component as the native app entry point. |
| `app.json`                 | React Native app registration name and display metadata.     |
| `package.json`             | Dependencies and scripts such as `start` and `android`.      |
| `pnpm-lock.yaml`           | Resolved dependency versions.                                |
| `android/build.gradle`     | SDK, build-tools, and NDK versions in the standard template. |
| `android/app/build.gradle` | App ID, version, build types, and signing.                   |
| `android/gradlew`          | Project-local Gradle launcher.                               |

Keep the generated entry point and native configuration. Installing a separate global Gradle or `react-native-cli` is unnecessary.

## 6. Install the SDK versions your project needs

Read the generated Android configuration **before choosing SDK versions**:

```bash
sed -n '1,45p' android/build.gradle
```

Find `compileSdkVersion`, `buildToolsVersion`, `ndkVersion`, and `minSdkVersion`. The [community template](https://github.com/react-native-community/template/blob/main/template/android/build.gradle) shows the structure, but its `main` branch can be ahead of a stable release. Your generated files are the reference for your app.

In Android Studio's **SDK Manager**, enable **Show Package Details** and install:

| SDK Manager tab | What to install                                                              |
| --------------- | ---------------------------------------------------------------------------- |
| SDK Platforms   | The Android SDK Platform matching `compileSdkVersion`.                       |
| SDK Tools       | Android SDK Build-Tools matching `buildToolsVersion`.                        |
| SDK Tools       | NDK (Side by side) matching `ndkVersion`.                                    |
| SDK Tools       | CMake if requested by the native build; install the version Gradle requests. |

Accept the licenses while installing. To check for remaining licenses:

```bash
sdkmanager --licenses
```

Gradle can download some missing native tools when licenses have been accepted. If it requests a specific CMake or NDK version, install that exact version rather than changing the template's version numbers. See [sdkmanager](https://developer.android.com/tools/sdkmanager).

Check the native build environment:

```bash
cd android
chmod +x gradlew
./gradlew --version
cd ..
```

The wrapper downloads its configured Gradle version on first use. The JVM shown should be Java 17.

`compileSdkVersion` is the API used to compile. `minSdkVersion` is the oldest Android API level allowed to install the app; the phone does not need to run the compile SDK version.

## 7. Prepare a phone or emulator

### Option A: physical Android phone

1. On the phone, open **Settings → About phone** and tap **Build number** seven times. Some devices put it under **Software information**.
2. Open **Developer options** and enable **USB debugging**.
3. Connect with a USB cable that supports data. If needed, choose **File transfer** in USB preferences.
4. Unlock the phone and accept its USB debugging authorization prompt.

```bash
adb devices -l
```

The device must show the status **`device`**. `unauthorized` means the phone has not accepted debugging authorization; `offline` means the connection is not ready. Use one connected phone or one running emulator while learning.

If Ubuntu reports USB permission problems:

```bash
sudo apt install -y android-sdk-platform-tools-common
sudo usermod -aG plugdev "$USER"
```

Log out of Ubuntu and log back in, then reconnect the phone. The package supplies Android USB rules; the group change takes effect after login. See [Android's hardware-device setup](https://developer.android.com/studio/run/device).

Check the phone's Android API level and compare it to the project's `minSdkVersion`:

```bash
adb shell getprop ro.build.version.sdk
```

### Option B: Android emulator

Skip this option if using a phone.

1. Enable Intel VT-x or AMD-V/SVM in the computer's BIOS/UEFI if disabled.
2. Install KVM and add your account to its group:

```bash
sudo apt install -y qemu-kvm
sudo usermod -aG kvm "$USER"
```

3. Log out and back in, then check acceleration:

```bash
emulator -accel-check
```

4. In Android Studio, open **Device Manager → Create Device**.
5. Choose a phone profile and a stable **x86_64** system image whose API level is at least the project's minimum. Download the image and start the virtual device.
6. Confirm it appears in `adb devices` with status `device`.

See [Android emulator acceleration](https://developer.android.com/studio/run/emulator-acceleration#vm-linux) for KVM troubleshooting.

## 8. Run the app during development

Both terminals below must start in **`NativePractice`**, the project root. In each new terminal, run `nvm use` there to select the recorded Node version.

**Terminal 1 — start Metro and leave it running:**

```bash
pnpm start
```

**Terminal 2 — connect the device to Metro and build the debug app:**

```bash
adb reverse tcp:8081 tcp:8081
pnpm android
```

The reverse mapping makes the device's port 8081 reach Metro on the computer. `pnpm android` runs the generated Android script: Gradle builds, installs, and launches the debug app. The first build downloads dependencies and usually takes longer.

For a USB phone, the development connection does not require both devices to be on the same Wi-Fi network. See [running React Native on a device](https://reactnative.dev/docs/running-on-device).

Save changes to `App.tsx` to see **Fast Refresh**. JavaScript changes usually refresh quickly; adding a native dependency requires rebuilding the Android app.

## 9. Try the sample app

Replace the **entire contents of `App.tsx`** with this code. Keep the filename and generated `index.js`.

The standard template includes `react-native-safe-area-context`. If your selected template does not, install it with `pnpm add react-native-safe-area-context`, then rebuild with `pnpm android`.

```tsx
import React, { useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <TaskScreen />
    </SafeAreaProvider>
  );
}

function TaskScreen() {
  const [draft, setDraft] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const nextId = useRef(1);
  const completedCount = tasks.filter((task) => task.completed).length;

  function addTask() {
    const title = draft.trim();
    if (!title) {
      return;
    }

    const task: Task = {
      id: String(nextId.current++),
      title,
      completed: false,
    };

    setTasks((previous) => [...previous, task]);
    setDraft("");
    Keyboard.dismiss();
  }

  function toggleTask(id: string) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id: string) {
    setTasks((previous) => previous.filter((task) => task.id !== id));
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.heading}>Native Practice</Text>
      <Text style={styles.subtitle}>Add a task. Tap it to mark it done.</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="What will you practise?"
          placeholderTextColor="#64748b"
          accessibilityLabel="New task"
          maxLength={100}
          returnKeyType="done"
          onSubmitEditing={addTask}
        />
        <Pressable
          style={[styles.addButton, !draft.trim() && styles.disabled]}
          onPress={addTask}
          disabled={!draft.trim()}
          accessibilityRole="button"
          accessibilityState={{ disabled: !draft.trim() }}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <Text style={styles.summary} accessibilityLiveRegion="polite">
        {completedCount} of {tasks.length} completed
      </Text>

      <FlatList
        style={styles.list}
        data={tasks}
        keyExtractor={(task) => task.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet. Add your first one.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Pressable
              style={styles.taskButton}
              onPress={() => toggleTask(item.id)}
              accessibilityRole="checkbox"
              accessibilityLabel={item.title}
              accessibilityState={{ checked: item.completed }}
            >
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedText,
                ]}
              >
                {item.completed ? "✓ " : "○ "}
                {item.title}
              </Text>
            </Pressable>
            <Pressable
              style={styles.deleteButton}
              onPress={() => deleteTask(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${item.title}`}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />

      <Text style={styles.footer}>
        Practice data stays in memory and resets when the app restarts.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, backgroundColor: "#f8fafc" },
  heading: { fontSize: 28, fontWeight: "700", color: "#0f172a", marginTop: 16 },
  subtitle: { fontSize: 16, color: "#475569", marginTop: 8, marginBottom: 20 },
  form: { flexDirection: "row", alignItems: "center", gap: 10 },
  input: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#0f172a",
    backgroundColor: "#ffffff",
  },
  addButton: {
    minHeight: 48,
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#2563eb",
  },
  addButtonText: { color: "#ffffff", fontWeight: "700" },
  disabled: { opacity: 0.4 },
  summary: { marginVertical: 18, fontSize: 16, color: "#475569" },
  list: { flex: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  taskButton: { flex: 1, minHeight: 48, justifyContent: "center", padding: 12 },
  taskText: { fontSize: 16, color: "#0f172a" },
  completedText: { textDecorationLine: "line-through", color: "#64748b" },
  deleteButton: { minHeight: 48, justifyContent: "center", padding: 12 },
  deleteText: { color: "#b91c1c", fontWeight: "600" },
  empty: { textAlign: "center", marginTop: 32, color: "#64748b" },
  footer: { fontSize: 12, color: "#64748b", marginVertical: 12 },
});
```

### What the code does

| Piece                               | Purpose                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| `Task` / `useState<Task[]>`         | Gives TypeScript the shape of each task; the rest follows familiar React logic. |
| `draft` / `TextInput`               | Keeps the input controlled by React state.                                      |
| `useRef`                            | Stores the next task ID without causing a re-render.                            |
| Functional state updates            | Read the latest state and create a new array instead of mutating it.            |
| `FlatList`                          | Renders a scrollable list with stable task IDs.                                 |
| `Pressable`                         | Handles taps and exposes button/checkbox semantics.                             |
| `SafeAreaProvider` / `SafeAreaView` | Keeps content clear of system bars and screen cutouts.                          |
| `StyleSheet.create`                 | Defines native styles; numeric dimensions use logical pixels.                   |

See the library's [safe-area usage guide](https://appandflow.github.io/react-native-safe-area-context/usage/). This example deliberately uses in-memory state: a full process restart starts a fresh list.

### Small exercises

1. Change the heading and button colour, save, and observe Fast Refresh.
2. Add the following button just before `FlatList` to remove completed tasks:

```tsx
<Pressable
  style={styles.deleteButton}
  accessibilityRole="button"
  onPress={() =>
    setTasks((previous) => previous.filter((task) => !task.completed))
  }
>
  <Text style={styles.deleteText}>Clear completed</Text>
</Pressable>
```

3. Change the input's `maxLength` and test the limit.
4. As a later exercise, add persistent storage and change the restart test to expect saved tasks.

## 10. Build a standalone signed APK

| Build       | Typical output                                             | Uses Metro at runtime?                                                   |
| ----------- | ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| Debug       | `android/app/build/outputs/apk/debug/app-debug.apk`        | Yes, with the standard template.                                         |
| Release APK | `android/app/build/outputs/apk/release/app-release.apk`    | No; JavaScript/assets are bundled.                                       |
| Release AAB | `android/app/build/outputs/bundle/release/app-release.aab` | No, but an AAB needs conversion/distribution before device installation. |

For phone installation by copying a file, build an **APK**. `assembleRelease` builds the APK; `bundleRelease` builds an AAB used for Play distribution. The [React Native Gradle plugin](https://reactnative.dev/docs/react-native-gradle-plugin) bundles JavaScript for non-debuggable variants automatically.

### A. Generate a private signing key once

Store the key outside the repository. The example certificate uses only a generic project label:

```bash
mkdir -p "$HOME/.android-keys"
chmod 700 "$HOME/.android-keys"
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore "$HOME/.android-keys/nativepractice-release.keystore" \
  -alias nativepractice \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=NativePractice"
chmod 600 "$HOME/.android-keys/nativepractice-release.keystore"
```

Enter a strong password when prompted and keep it with a private backup of the keystore. This PKCS12 example uses the same password for the store and key. Reuse this key for future updates; do not regenerate it each build. See [Android app signing](https://developer.android.com/studio/publish/app-signing).

### B. Keep the password outside Git

```bash
mkdir -p "$HOME/.gradle"
touch "$HOME/.gradle/gradle.properties"
chmod 600 "$HOME/.gradle/gradle.properties"
```

Edit **`~/.gradle/gradle.properties`**, preserving any existing contents, and add:

```properties
NATIVE_PRACTICE_STORE_PASSWORD=REPLACE_WITH_YOUR_KEYSTORE_PASSWORD
```

Replace the placeholder locally. Do not put this password in the project's `android/gradle.properties`, a command line, or the public guide.

### C. Configure the release signing block

Open **`android/app/build.gradle`**. Inside its existing `android { ... }` block:

1. Find `signingConfigs { ... }` and **add** this `release` block alongside the existing `debug` block:

```groovy
release {
    storeFile file("${System.getProperty('user.home')}/.android-keys/nativepractice-release.keystore")
    storePassword providers.gradleProperty('NATIVE_PRACTICE_STORE_PASSWORD').getOrNull()
    keyAlias 'nativepractice'
    keyPassword providers.gradleProperty('NATIVE_PRACTICE_STORE_PASSWORD').getOrNull()
}
```

2. Find `buildTypes { release { ... } }`. Set its signing line to:

```groovy
signingConfig signingConfigs.release
```

Replace a pre-existing `signingConfig signingConfigs.debug` line in the **release build type** if present. Keep the other generated build settings, including the debug signing block. If a `release` signing configuration already exists, edit that block instead of adding a duplicate.

The password lookup returns `null` when unset, allowing someone cloning the public repo to configure signing later; a signed release still requires the actual password and keystore. The [React Native signing guide](https://reactnative.dev/docs/signed-apk-android) explains this Gradle structure.

### D. Build the APK

First check the sample code from the project root:

```bash
pnpm exec tsc --noEmit
pnpm lint
```

Then build:

```bash
cd android
./gradlew assembleRelease
cd ..
```

Wait for **`BUILD SUCCESSFUL`**. A connected phone and a running Metro server are unnecessary for this build. Keep the template's default architecture configuration for the first APK; limiting it to an emulator architecture can prevent installation on a phone.

Check the output:

```bash
ls -lh android/app/build/outputs/apk/release/app-release.apk
```

Verify the signature. Replace `YOUR_BUILD_TOOLS_VERSION` with `buildToolsVersion` from `android/build.gradle`:

```bash
"$ANDROID_HOME/build-tools/YOUR_BUILD_TOOLS_VERSION/apksigner" verify \
  --verbose \
  --print-certs \
  android/app/build/outputs/apk/release/app-release.apk
```

The certificate's signer label should match the generic `CN=NativePractice` label you generated. See [apksigner verification](https://developer.android.com/tools/apksigner#verify).

## 11. Transfer and install the APK

Run these from the project root. Pick either installation method.

### Method A: install directly over USB with ADB

This is the quickest route for development and testing:

```bash
adb devices
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

`install` transfers and installs the APK. `-r` replaces an existing compatible installation while retaining its saved app data. Android requires compatible signatures; see [ADB installation commands](https://developer.android.com/tools/adb#move).

If the earlier debug app used the same app ID but a different signing key, uninstall that **practice app** first. Find its `applicationId` in `android/app/build.gradle`. The standard name for this project is usually `com.nativepractice`; check rather than assume:

```bash
adb uninstall YOUR_APPLICATION_ID
adb install android/app/build/outputs/apk/release/app-release.apk
```

Replace `YOUR_APPLICATION_ID` with the actual ID. **Uninstalling deletes that app's local data.** Signing mismatch is expected when switching between debug and your private release key.

If more than one device is connected, select one explicitly:

```bash
adb -s DEVICE_SERIAL install -r android/app/build/outputs/apk/release/app-release.apk
```

Use the serial shown by `adb devices` in place of `DEVICE_SERIAL`.

### Method B: copy the APK, then tap to install

With the USB-debugging connection already set up, copy to the phone's shared Downloads folder:

```bash
adb push android/app/build/outputs/apk/release/app-release.apk \
  /sdcard/Download/native-practice.apk
```

Alternatively, use the phone's USB **File transfer** mode and Ubuntu's file manager to copy `app-release.apk` into **Download**. This file-copy route does not require USB debugging.

On the phone:

1. Open **Files / Downloads** and tap the APK.
2. If prompted, allow **Install unknown apps / Allow from this source** for the file manager that opened it. The wording varies by Android version and manufacturer.
3. Tap **Install**, then **Open**. A managed phone can restrict installation.
4. Turn the file manager's installation permission off again when finished.

Phone security checks may ask to scan the APK. Follow the device's normal prompts for your own build. Resolve a previous incompatible installation as described above if necessary.

## 12. Test it on the phone

Open **NativePractice** from the launcher. For the standalone test, stop Metro with **Ctrl+C**, disconnect USB, enable airplane mode, and launch the release app again.

| Test                                                  | Expected result                                                   |
| ----------------------------------------------------- | ----------------------------------------------------------------- |
| Start with no computer connection                     | The screen opens without contacting Metro.                        |
| Tap Add with an empty/space-only input                | The button is disabled and no task is added.                      |
| Enter a task, then tap Add or the keyboard's Done key | One task appears and the input clears.                            |
| Tap a task twice                                      | It toggles complete, then incomplete; the count updates.          |
| Delete a task                                         | Only that task disappears and the count stays correct.            |
| Add several identical titles                          | Each remains independently tappable/deletable because IDs differ. |
| Add a long title and many tasks                       | Text wraps and the list scrolls.                                  |
| Open/close the keyboard                               | Input and Add remain usable.                                      |
| Try a larger system font / a screen with a cutout     | Check readability, wrapping, and safe areas.                      |
| Background the app and return                         | State usually remains while its process is alive.                 |
| Force-stop in Android Settings, then reopen           | The task list is empty: this sample has no persistent storage.    |
| Keep airplane mode on                                 | Adding, toggling, and deleting still work.                        |

After installing a rebuilt release, repeat the disconnected test. JavaScript edits reach an installed release APK only after rebuilding and reinstalling it.

### Inspect a crash

Reconnect USB, restore debugging authorization if needed, and read the crash buffer:

```bash
adb logcat -b crash
```

Or watch general logs while reproducing the problem:

```bash
adb logcat
```

Press **Ctrl+C** to stop streaming. Android Studio's **Logcat** view can filter by app process. Debug builds also provide [React Native DevTools](https://reactnative.dev/docs/debugging); the developer tools are unavailable in a standard release build.

## 13. Make changes and rebuild

During development, edit `App.tsx` with Metro running and use Fast Refresh.

For a new standalone APK:

1. Keep the same app ID and signing key.
2. In `android/app/build.gradle`, increment the existing `versionCode` and update `versionName`, for example:

```groovy
versionCode 2
versionName '1.1'
```

3. Run the code checks and build again:

```bash
pnpm exec tsc --noEmit
pnpm lint
cd android
./gradlew assembleRelease
cd ..
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

4. Open the app and verify your visible change with Metro stopped.

With the same signature and a suitable version code, `-r` preserves saved app data. It cannot preserve this example's task array across a process restart because the array only lives in memory.

## 14. Troubleshooting

| Symptom                                 | Check / fix                                                                                                    |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `adb: command not found`                | Install Platform-Tools; reload `.bashrc`; check `ANDROID_HOME` and `PATH`.                                     |
| `sdkmanager: command not found`         | Install Command-line Tools (latest); check `cmdline-tools/latest/bin` is on `PATH`.                            |
| No phone in `adb devices`               | Try a data cable/another USB port; unlock the phone; enable USB debugging.                                     |
| `unauthorized`                          | Accept the phone's authorization prompt; reconnect or revoke/re-authorize USB debugging if it does not appear. |
| `no permissions`                        | Install Ubuntu USB rules, join `plugdev`, and log out/back in; avoid running ADB with `sudo`.                  |
| `offline` or a stale device connection  | Reconnect; try `adb kill-server`, then `adb start-server`.                                                     |
| SDK/NDK/build-tools missing             | Install the version requested by the generated Gradle configuration in SDK Manager.                            |
| Licenses not accepted                   | Run `sdkmanager --licenses` and accept the required licenses.                                                  |
| Java/Gradle compatibility failure       | Check `JAVA_HOME`, `java -version`, and `./gradlew --version`; use JDK 17 with the generated wrapper.          |
| Debug app cannot load JavaScript        | Keep `pnpm start` running; repeat `adb reverse tcp:8081 tcp:8081` after reconnecting.                          |
| Metro package-resolution error          | Confirm `nodeLinker: hoisted` was configured before installing; reinstall dependencies if the layout changed.  |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE`    | Existing app uses another signing key; uninstall only that practice app, then install again.                   |
| `INSTALL_FAILED_VERSION_DOWNGRADE`      | Increase `versionCode`; uninstalling the practice app is another option but deletes its data.                  |
| `INSTALL_FAILED_OLDER_SDK`              | Phone API level is below the app's minimum; use a supported phone/emulator.                                    |
| `INSTALL_FAILED_NO_MATCHING_ABIS`       | APK excludes the phone's CPU architecture; restore appropriate `reactNativeArchitectures` and rebuild.         |
| APK says it needs Metro                 | Confirm you installed `app-release.apk`; do not mark `release` as a debuggable variant.                        |
| Emulator is very slow / KVM unavailable | Check BIOS virtualization, `/dev/kvm` access, group membership, and `emulator -accel-check`.                   |

For a stale Metro cache, stop Metro and restart it from the project root:

```bash
pnpm start --reset-cache
```

If you changed pnpm's linker after installing, stop Metro/builds, remove only the project's generated `node_modules`, and reinstall from the lockfile:

```bash
rm -rf node_modules
pnpm install --frozen-lockfile
```

Only if a native build remains stale after a configuration/dependency change:

```bash
cd android
./gradlew clean
cd ..
```

Cleaning deletes native build outputs; the next build takes longer. It is unnecessary for every code edit.

When adding an API later, remember that `localhost` inside the app means the Android device. A standard emulator reaches the host via `10.0.2.2`; a USB phone can use an explicit ADB reverse mapping for the API port. Production APIs should use HTTPS; Android can block plain HTTP. See [emulator networking](https://developer.android.com/studio/run/emulator-networking) and [React Native networking](https://reactnative.dev/docs/network).

## 15. Keep the project in GitHub

You can keep this document as `docs/react-native-ubuntu-android.md` in a revision repository, or use it as the practice app's `README.md`.

For the app itself, keep the generated `.gitignore`. Make sure these patterns are present, adding any missing ones:

```gitignore
node_modules/
android/.gradle/
android/build/
android/app/build/
android/local.properties
*.apk
*.aab
*.jks
*.keystore
!android/app/debug.keystore
.env
.env.*
!.env.example
```

The exception permits the standard template's public **debug** keystore, if supplied. Your private release key remains outside the repository. Also keep machine-specific SDK paths, signing passwords, and real credentials out of tracked files.

From the practice project root:

```bash
git init
git add .
git status --short
git diff --cached --stat
```

Review the staged files. Include the source, generated native projects, Gradle wrapper files, package manifest, pnpm configuration, `.nvmrc`, and lockfile. Then create the local commit:

```bash
git commit -m "Add React Native Android practice app"
```

Use an existing Git identity or a GitHub-provided **noreply** email if you want commit metadata to avoid exposing a personal email. After creating a repository in GitHub, follow its instructions to add the remote and push. Keep APKs as local test files or attach an intended distributable to a GitHub Release rather than committing build outputs.

## 16. Revision cheat sheet

Run these from the project root unless indicated:

| Action                             | Command                                                                                               |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Reuse the recorded Node version    | `nvm install` then `nvm use`                                                                          |
| Install recorded dependencies      | `pnpm install --frozen-lockfile`                                                                      |
| List Android devices               | `adb devices`                                                                                         |
| Start live JavaScript development  | `pnpm start`                                                                                          |
| Connect a USB device to Metro      | `adb reverse tcp:8081 tcp:8081`                                                                       |
| Build/install/launch debug app     | `pnpm android`                                                                                        |
| Check TypeScript                   | `pnpm exec tsc --noEmit`                                                                              |
| Check code style                   | `pnpm lint`                                                                                           |
| Build debug APK                    | From `android/`: `./gradlew assembleDebug`                                                            |
| Build signed standalone APK        | From `android/`: `./gradlew assembleRelease`                                                          |
| Build AAB for distribution tooling | From `android/`: `./gradlew bundleRelease`                                                            |
| Install/update release APK         | `adb install -r android/app/build/outputs/apk/release/app-release.apk`                                |
| Copy APK to phone Downloads        | `adb push android/app/build/outputs/apk/release/app-release.apk /sdcard/Download/native-practice.apk` |
| Read Android crash logs            | `adb logcat -b crash`                                                                                 |

**Learning loop:** change a component → run the debug app → check on the phone → build the release APK → install it → test with Metro stopped and USB disconnected.
