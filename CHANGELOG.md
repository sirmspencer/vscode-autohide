# Change Log

### 1.1.2

* Publish releases to the Visual Studio Marketplace and Open VSX from a GitHub Actions workflow triggered by version tags.

### 1.1.1

* `autoHide.autoHideReferences` now defaults to `false`. Clicking inside the References panel counts as a click into a text editor, so the panel closed while it was being used (#34).
* The References panel now closes after the same 10ms delay as the other parts instead of immediately.
* Add `autoHide.keepSideBarWhileDebugging` to keep the side bar open while a debug session is running (#41).
* Document a keybinding for closing the terminal with Escape (#47).
* Fix the text selection listener not being disposed when the extension is deactivated.
* Add unit tests for the click detection and hide logic; remove the obsolete test runner.

### 1.1.0

* Remove `autoHide.sideBarDelay` and `autoHide.panelDelay` settings; panels now hide after a fixed 10ms delay.
* Activate on `onStartupFinished` instead of `*`.
* Require VS Code 1.74 or later.
* Replace deprecated `vscode` dev dependency with `@types/vscode`; update TypeScript and `@vscode/vsce`.
* Add Open VSX publishing for VSCodium.

### 1.0.10

* Fix deploy of 1.0.9
* track package-lock.json

### 1.0.9

* Automatic hiding of bars and panels when the window is opened works based on "autoHide.hideOnOpen" and their individual options instead of just "autoHide.hideOnOpen".
* "autoHide.hideOnOpen" option defaults to false

### 1.0.8

* Add `autoHide.autoHideReferences` to close the References panel (`Go to References`) on click, enabled by default (#25).
* Do not hide the panel when clicking inside the Output panel (#30).
* Add `autoHide.autoHideAuxiliaryBar` and the `autoHide.toggleHideAuxiliaryBar` command for the auxiliary bar (#31).

### 1.0.7

* Add "extensionKind" to package.json

### 1.0.6

* Add commands so the user can toggle the hide options for the local environment.

### 1.0.5

* Added new option to close panel and side bar on open.
* Convert to space indents in the code base.

### 1.0.4

* FIX changed settings now take immediate affect.

### 1.0.3

* Add search keywords

### 1.0.2

* Update readme to show Visual Studio Code version requirements.
* Upgrade mocha to 7.1

### 1.0.1

* Initial release.  This release expands upon the work done here <https://github.com/Venryx/vscode-vtools> by using newer closePanel and closeSidebar commands for a smoother experience.
