## *Requires Visual Studio Code, version 1.43 or higher

# Auto Hide

Extension install page: <https://marketplace.visualstudio.com/items?itemName=sirmspencer.vscode-autohide>

## Features

### Auto-hide side bar
Causes the side bar to be hidden whenever the user clicks into the text editor.

I highly recommend trying the sidbar on the right side.  The side bar does not so when on the left, the editor text will shift when the side panel opening and closeing.

![Auto-hide side bar](Images/Features/AutoHideSideBar.gif)

### Auto-hide bottom panel
Same thing as above, except for the bottom panel (output, terminal, etc. are contained in the panel).

## Settings

* `autoHide.autoHideSideBar`: Hide the side bar when the user clicks into a text editor. [boolean, default: `true`]
* `autoHide.autoHideBottomPanel`: Hide the panel (output, terminal, etc.) when the user clicks into a text editor. [boolean, default: `true`]
* `autoHide.sideBarDelay`: How long to wait before hiding the side bar. A delay prevents text from being selected. A longer delay allows the horizontal scroll to adjust to the change in selection before the side bar hiding causes the horizontal scroll to adjust, avoiding conflicts. [number, default: `450`]
* `autoHide.panelDelay`: How long to wait before hiding the panel. Same as for the side bar when the panel is on the side.  If the panel is on the bottom, there is no need for delay. [number, default: `300`]

## Developing

1) Clone/download repo: https://github.com/sirmspencer/vscode-autohide.git
2) Make code changes in "src" folder.
3) Run "npm run compile". (this will start compiler in watch mode) [if editing in vscode, Ctrl+Shift+B also works]
4) In vscode, open the Debug panel and launch the extension from there.

## Publishing

https://code.visualstudio.com/api/working-with-extensions/publishing-extension

## Credit to 'VTools for Visual Studio Code'

This extension is a heavily modified version of:
<https://marketplace.visualstudio.com/items?itemName=venryx.vscode-vtools>