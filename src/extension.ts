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
        let scheme = selection.textEditor.document.uri.scheme

        if (selection.kind != TextEditorSelectionChangeKind.Mouse // selection was not from a click
            || selection.selections.length != 1                   // no selections or multiselections
            || selection.selections.find(a=>a.isEmpty) == null    // multiselections
            || !pathIsFile                                        // The debug window editor
            || scheme == "output" ) {                             // The output window
            return;
        } else {
            if (config.autoHideReferences) {
                vscode.commands.executeCommand("closeReferenceSearch");
            }

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
                if (config.autoHideAuxiliaryBar) {
                    vscode.commands.executeCommand("workbench.action.closeAuxiliaryBar");
                }
            }, config.sideBarDelay);
        };
    });

    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHidePanel", async() => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update("autoHidePanel", !config.autoHidePanel, vscode.ConfigurationTarget.Workspace);
        }));
    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHideSideBar", async() => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update("autoHideSideBar", !config.autoHideSideBar, vscode.ConfigurationTarget.Workspace);
        }));
    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHideAuxiliaryBar", async() => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update("autoHideAuxiliaryBar", !config.autoHideAuxiliaryBar, vscode.ConfigurationTarget.Workspace);
        }));
}

export function deactivate() {}
