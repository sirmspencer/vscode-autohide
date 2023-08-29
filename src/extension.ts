"use strict";
import * as vscode from "vscode";
import { TextEditorSelectionChangeKind } from "vscode";

export function activate(context: vscode.ExtensionContext) {
  var toggles = [];

  vscode.window.onDidChangeTextEditorSelection((selection) => {
    let config = vscode.workspace.getConfiguration("autoHide");
    let path = vscode.window.activeTextEditor.document.fileName;
    let pathIsFile =
      path.includes(".") || path.includes("\\") || path.includes("/");
    let scheme = selection.textEditor.document.uri.scheme;

    if (
      selection.kind != TextEditorSelectionChangeKind.Mouse || // selection was not from a click
      selection.selections.length != 1 || // no selections or multiselections
      selection.selections.find((a) => a.isEmpty) == null || // multiselections
      !pathIsFile || // The debug window editor
      scheme == "output"
    ) {
      // The output window
      return;
    } else {
      /* -------------------------------------------------------------------- */
      /*                      Close the differents views                      */
      /* -------------------------------------------------------------------- */
      if (config.ReferencesAutoHide) {
        vscode.commands.executeCommand("closeReferenceSearch");
      }
      ["Sidebar", "Panel", "AuxiliaryBar"].forEach((t) => {
        setTimeout(() => {
          if (config.get(`${t}AutoHide`)) {
            vscode.commands.executeCommand(`workbench.action.close${t}`);
          }
        }, config.get(`${t}AutoHideDelay`));
      });
    }
  });

  /* ------------------------------------------------------------------------ */
  /*                   Register the Auto Toggle commands                      */
  /* ------------------------------------------------------------------------ */
  ["Sidebar", "Panel", "AuxiliaryBar"].forEach((t) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(`autoHide.toggleHide${t}`, async () => {
        let config = vscode.workspace.getConfiguration("autoHide");
        if (!config.get(`${t}AutoHide`)) {
          toggles[t].toggle("hide");
        }
        await config.update(`${t}AutoHide`, !config.get(`${t}AutoHide`), true);
      })
    );
  });

  /* -------------------------------------------------------------------------- */
  /*                            Handle toggle buttons                           */
  /* -------------------------------------------------------------------------- */
  let config = vscode.workspace.getConfiguration("autoHide");

  const inactiveColor = new vscode.ThemeColor("statusBarItem.foreground");
  const pinnedColor = new vscode.ThemeColor("autoHide.pinnedColor");
  const unpinnedColor = new vscode.ThemeColor("autoHide.unpinnedColor");
  const PRIORITY_SHOW = 1000;
  function setToogleButton({ reset = false }: { reset?: boolean } = {}) {
    let config = vscode.workspace.getConfiguration("workbench");
    let value = config.get("sideBar.location");
    if (value == "left") {
      var matchingIcons = {
        Sidebar: "$(layout-sidebar-left)",
        Panel: "$(layout-panel)",
        AuxiliaryBar: "$(layout-sidebar-right)",
      };
    } else {
      var matchingIcons = {
        Sidebar: "$(layout-sidebar-right)",
        Panel: "$(layout-panel)",
        AuxiliaryBar: "$(layout-sidebar-left)",
      };
    }

    ["Sidebar", "Panel", "AuxiliaryBar"].forEach((t) => {
      if (reset && toggles[t] && toggles[t].button) {
        toggles[t].button.dispose();
      }

      toggles[t] = {};
      toggles[t].button = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        PRIORITY_SHOW
      );
      toggles[t].button.color = inactiveColor;
      toggles[t].button.text = `${matchingIcons[t]}`;
      toggles[t].button.command = `autoHide.toggleOn${t}`;
      toggles[t].button.show();

      toggles[t].toggle = (action: string) => {
        switch (action) {
          case "show":
            toggles[t].button.color = unpinnedColor;
            toggles[t].button.command = `autoHide.pin${t}`;
            toggles[t].button.text = `$(timeline-view-icon)${matchingIcons[t]}`;
            break;

          case "pin":
            toggles[t].button.color = pinnedColor;
            toggles[t].button.command = `autoHide.unpin${t}`;
            toggles[t].button.text = `$(pinned)${matchingIcons[t]}`;
            break;

          case "hide":
            toggles[t].button.color = inactiveColor;
            toggles[t].button.text = `${matchingIcons[t]}`;
            toggles[t].button.command = `autoHide.toggleOn${t}`;
        }
        toggles[t].button.show();
      };
    });
  }
  setToogleButton();

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("workbench.sideBar.location")) {
        setToogleButton({ reset: true });
      }
    })
  );

  ["Sidebar", "Panel", "AuxiliaryBar"].forEach((t) => {
    // Show the view
    vscode.commands.registerCommand(`autoHide.toggleOn${t}`, () => {
      vscode.commands.executeCommand(
        `workbench.action.toggle${t == "Sidebar" ? t + "Visibility" : t}`
      );
      toggles[t].toggle("show");
      clearTimeout(toggles[t].timeout);
    });

    // Pin the view
    vscode.commands.registerCommand(`autoHide.pin${t}`, () => {
      config.update(`${t}AutoHide`, false, true);
      vscode.commands.executeCommand("setContext", `autoHide.${t}Pinned`, true);
      toggles[t].toggle("pin");
      clearTimeout(toggles[t].timeout);
    });

    // Unpin & hide the view
    vscode.commands.registerCommand(`autoHide.unpin${t}`, () => {
      config.update(`${t}AutoHide`, true, true);
      vscode.commands.executeCommand(
        "setContext",
        `autoHide.${t}Pinned`,
        false
      );
      vscode.commands.executeCommand(`workbench.action.close${t}`);
      toggles[t].toggle("hide");
      clearTimeout(toggles[t].timeout);
    });

    if (config.get(`${t}AutoHideOnOpen`)) {
      vscode.commands.executeCommand(`autoHide.unpin${t}`);
    } else {
      toggles[t].toggle("hide");
    }
  });

  /* -------------------------------------------------------------------------- */
  /*         Handle the window lose focus event during Debug Sessions           */
  /* -------------------------------------------------------------------------- */
  let focusTimeout: ReturnType<typeof setTimeout>;
  context.subscriptions.push(
    vscode.window.onDidChangeWindowState((e) => {
      if (
        config.PanelRevealDebugSess &&
        !e.focused &&
        vscode.debug.activeDebugSession
      ) {
        focusTimeout = setTimeout(function () {
          vscode.commands.executeCommand("workbench.panel.repl.view.focus");
        }, config.PanelRevealDebugSessDelay);
      } else {
        clearTimeout(focusTimeout);
      }
    })
  );
}

export function deactivate() {}
