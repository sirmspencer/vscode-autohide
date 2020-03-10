"use strict";
import * as vscode from "vscode";
import { TextEditorSelectionChangeKind } from "vscode"

export function activate(context: vscode.ExtensionContext) {
	let config = vscode.workspace.getConfiguration("autoHide");
	if (true) {
		vscode.window.onDidChangeTextEditorSelection(selection => {
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
			};
		});
	}
}

export function deactivate() {}
