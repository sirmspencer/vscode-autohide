## *This project is in maintenance mode.  It does everything I need.  I will accept PRs for small new features, but I won't be adding any new features myself.  The readme contains full instructions on how to publish.  Feel free to fork and publish what every fancy or specific changes you want.

# Auto Hide

Extension install pages:

* VS Code Marketplace: <https://marketplace.visualstudio.com/items?itemName=sirmspencer.vscode-autohide>
* Open VSX (VSCodium and other open source builds): <https://open-vsx.org/extension/sirmspencer/vscode-autohide>

Requires VS Code 1.74 or later.

## Features

### Auto-hide side bar

Causes the side bar to be hidden whenever the user clicks into the text editor.

I highly recommend trying the sidebar on the right side.  The side bar does not so when on the left, the editor text will shift when the side panel opening and closing.

![Auto-hide side bar](Images/Features/AutoHideSideBar.gif)

### Auto-hide bottom panel

Same thing as above, except for the bottom panel (output, terminal, etc. are contained in the panel). Clicks inside the Output panel do not hide it.

### Auto-hide auxiliary bar

Same thing as above, for the auxiliary bar (the second side bar).

### Auto-hide References panel

Optionally closes the References panel opened by `Go to References`. This is disabled by default; see `autoHide.autoHideReferences` below.

## Settings

* `autoHide.autoHideSideBar`: Hide the side bar when the user clicks into a text editor. [boolean, default: `true`]
* `autoHide.autoHideAuxiliaryBar`: Hide the auxiliary bar (second side bar) when the user clicks into a text editor. [boolean, default: `true`]
* `autoHide.autoHidePanel`: Hide the panel (output, terminal, etc.) when the user clicks into a text editor. [boolean, default: `true`]
* `autoHide.autoHideReferences`: Hide the References panel (`Go to References`) when the user clicks into a text editor. Clicking inside the References panel also counts as a click into a text editor, which closes the panel while it is being used. [boolean, default: `false`]
* `autoHide.keepSideBarWhileDebugging`: Do not hide the side bar while a debug session is running. [boolean, default: `false`]
* `autoHide.hideOnOpen`: When VS Code first opens, hide each part whose auto-hide setting is enabled. [boolean, default: `false`]

## Commands

* `autoHide.toggleHideSideBar`: Toggle `autoHide.autoHideSideBar` setting for current workspace. Use this command to pin/unpin the side bar.
* `autoHide.toggleHideAuxiliaryBar`: Toggle `autoHide.autoHideAuxiliaryBar` setting for current workspace. Use this command to pin/unpin the auxiliary bar.
* `autoHide.toggleHidePanel`: Toggle `autoHide.autoHidePanel` setting for current workspace. Use this command to pin/unpin the panel.

## Tips

### Hide the terminal with Escape

The extension does not bind any keys. To close the panel by pressing Escape while the terminal has focus, add the following to `keybindings.json`. Programs running in the terminal will no longer receive the Escape key.

```json
{
    "key": "escape",
    "command": "workbench.action.closePanel",
    "when": "terminalFocus"
}
```

## Developing

*Developing and Publishing sections updated with LLM assistance*

1) Clone the repo: <https://github.com/sirmspencer/vscode-autohide.git>
2) Run `npm install`.
3) Make code changes in the `src` folder.
4) Run `npm run compile` to start the compiler in watch mode. In VS Code, Ctrl+Shift+B also works.
5) Run `npm test` to compile and run the unit tests.
6) In VS Code, open the Run and Debug panel and launch the extension from there.

## Publishing

The extension is published to two registries. VS Code uses the Visual Studio Marketplace. VSCodium and other open source builds use Open VSX, which requires a separate publish.

Bump `version` in `package.json` and add a `CHANGELOG.md` entry before publishing.

### Build the package

```sh
npm run package
```

This produces `vscode-autohide-<version>.vsix`.

### Visual Studio Marketplace

Create a personal access token in Azure DevOps (<https://dev.azure.com/>) with the Marketplace "Manage" scope.

```sh
npx vsce login sirmspencer
npm run publish
```

<https://code.visualstudio.com/api/working-with-extensions/publishing-extension>

### Open VSX

One-time setup:

1) Sign in to <https://open-vsx.org> with GitHub and sign the Eclipse Foundation publisher agreement.
2) Create an access token under user settings.
3) Create the namespace:

```sh
npx ovsx create-namespace sirmspencer -p <token>
```

Publish the packaged `.vsix`, so both registries receive the same build:

```sh
npm run publish:ovsx -- vscode-autohide-<version>.vsix -p <token>
```

The token can also be supplied through the `OVSX_PAT` environment variable instead of `-p`.

<https://github.com/eclipse/openvsx/wiki/Publishing-Extensions>

## Credit to 'VTools for Visual Studio Code'

This extension is a heavily modified version of:
<https://marketplace.visualstudio.com/items?itemName=venryx.vscode-vtools>
