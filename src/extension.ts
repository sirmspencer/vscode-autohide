"use strict";

import * as vscode from "vscode";
import { TextEditorSelectionChangeKind } from "vscode";

export function activate(context: vscode.ExtensionContext) {
    const initialConfig = vscode.workspace.getConfiguration("autoHide");

    if (initialConfig.hideOnOpen) {
        if (initialConfig.autoHideReferences) {
            vscode.commands.executeCommand("closeReferenceSearch");
        }

        if (initialConfig.autoHidePanel) {
            vscode.commands.executeCommand("workbench.action.closePanel");
        }

        if (initialConfig.autoHideSideBar) {
            vscode.commands.executeCommand("workbench.action.closeSidebar");
        }

        if (initialConfig.autoHideAuxiliaryBar) {
            vscode.commands.executeCommand("workbench.action.closeAuxiliaryBar");
        }
    }

    vscode.window.onDidChangeTextEditorSelection(selection => {
        const config = vscode.workspace.getConfiguration("autoHide");
        const path = vscode.window.activeTextEditor.document.fileName;
        const pathIsFile = path.includes(".") || path.includes("\\") || path.includes("/");
        const scheme = selection.textEditor.document.uri.scheme;

        if (
            selection.kind != TextEditorSelectionChangeKind.Mouse || // selection was not from a click
            selection.selections.length != 1 ||                      // no selections or multiselections
            selection.selections.find(a => a.isEmpty) == null ||     // multiselections
            !pathIsFile ||                                           // The debug window editor
            scheme == "output"                                       // The output window
        ) {
            return;
        }

        if (config.autoHideReferences) {
            vscode.commands.executeCommand("closeReferenceSearch");
        }

        setTimeout(function () {
            if (config.autoHidePanel) {
                vscode.commands.executeCommand("workbench.action.closePanel");
            }
        }, config.panelDelay);

        setTimeout(function () {
            if (config.autoHideSideBar) {
                vscode.commands.executeCommand("workbench.action.closeSidebar");
            }
        }, config.sideBarDelay);

        setTimeout(function () {
            if (config.autoHideAuxiliaryBar) {
                vscode.commands.executeCommand("workbench.action.closeAuxiliaryBar");
            }
        }, config.sideBarDelay);
    });

    // Workspace commands
    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHideSideBarWorkspace", async () => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update(
                "autoHideSideBar",
                !config.get("autoHideSideBar"),
                vscode.ConfigurationTarget.Workspace
            );
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHideAuxiliaryBarWorkspace", async () => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update(
                "autoHideAuxiliaryBar",
                !config.get("autoHideAuxiliaryBar"),
                vscode.ConfigurationTarget.Workspace
            );
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHidePanelWorkspace", async () => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update(
                "autoHidePanel",
                !config.get("autoHidePanel"),
                vscode.ConfigurationTarget.Workspace
            );
        })
    );

    // Global commands
    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHideSideBarGlobal", async () => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update(
                "autoHideSideBar",
                !config.get("autoHideSideBar"),
                vscode.ConfigurationTarget.Global
            );
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHideAuxiliaryBarGlobal", async () => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update(
                "autoHideAuxiliaryBar",
                !config.get("autoHideAuxiliaryBar"),
                vscode.ConfigurationTarget.Global
            );
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHidePanelGlobal", async () => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update(
                "autoHidePanel",
                !config.get("autoHidePanel"),
                vscode.ConfigurationTarget.Global
            );
        })
    );
}

export function deactivate() { }
