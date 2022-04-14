"use strict";
import * as vscode from "vscode";
import { TextEditorSelectionChangeKind } from "vscode"

export function activate(context: vscode.ExtensionContext) {

    if (vscode.workspace.getConfiguration("autoHide").hideOnOpen) {
        vscode.commands.executeCommand("workbench.action.closePanel");
        vscode.commands.executeCommand("workbench.action.closeSidebar");
        vscode.commands.executeCommand("workbench.action.closeAuxiliaryBar");
    };

    vscode.window.onDidChangeTextEditorSelection(selection => {
        let config = vscode.workspace.getConfiguration("autoHide");
        let path = vscode.window.activeTextEditor.document.fileName;
        let pathIsFile = path.includes(".") || path.includes("\\") || path.includes("/");

        if (selection.kind != TextEditorSelectionChangeKind.Mouse // selection was not from a click
            || selection.selections.length != 1                   // no selections or multiselections
            || selection.selections.find(a=>a.isEmpty) == null    // multiselections
            || !pathIsFile) {                                     // The debug window editor
            return;
        } else {
            setTimeout(function() {
                if (config.autoHidePanel) {
                    vscode.commands.executeCommand("workbench.action.closePanel");
                }
            }, config.panelDelay);

            setTimeout(function() {
                if (config.autoHideSideBar) {
                    vscode.commands.executeCommand("workbench.action.closeSidebar");
                }
            }, config.sideBarDelay);

            setTimeout(function() {
                if (config.autoHideSecondarySideBar) {
                    vscode.commands.executeCommand("workbench.action.closeAuxiliaryBar");
                }
            }, config.secondarySideBarDelay);
        };
    });

    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHidePanel", async() => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update("autoHidePanel", !config.autoHidePanel, vscode.ConfigurationTarget.Workspace);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHideSideBar", async() => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update("autoHideSideBar", !config.autoHideSideBar, vscode.ConfigurationTarget.Workspace);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHideSecondarySideBar", async() => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update("autoHideSecondarySideBar", !config.autoHideSecondarySideBar, vscode.ConfigurationTarget.Workspace);
        })
    );
}

export function deactivate() {}
