import * as vscode from "vscode";
import { findHideCommands, isPlainClick } from "./hide";

// short delay so the click registers before the layout shifts
const HIDE_DELAY_MS = 10;

const TOGGLES: [command: string, setting: string][] = [
    ["autoHide.toggleHidePanel", "autoHidePanel"],
    ["autoHide.toggleHideSideBar", "autoHideSideBar"],
    ["autoHide.toggleHideAuxiliaryBar", "autoHideAuxiliaryBar"],
];

function findConfig() {
    return vscode.workspace.getConfiguration("autoHide");
}

function hideAll(config: vscode.WorkspaceConfiguration) {
    const debugging = vscode.debug.activeDebugSession !== undefined;

    for (const command of findHideCommands(config, debugging)) {
        vscode.commands.executeCommand(command);
    }
}

export function activate(context: vscode.ExtensionContext) {
    const initialConfig = findConfig();

    if (initialConfig.hideOnOpen) {
        hideAll(initialConfig);
    }

    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(event => {
            const { document } = event.textEditor;
            const click = {
                fromMouse: event.kind === vscode.TextEditorSelectionChangeKind.Mouse,
                selections: event.selections,
                fileName: document.fileName,
                scheme: document.uri.scheme,
            };

            if (isPlainClick(click)) {
                const config = findConfig();
                setTimeout(() => hideAll(config), HIDE_DELAY_MS);
            }
        })
    );

    for (const [command, setting] of TOGGLES) {
        context.subscriptions.push(
            vscode.commands.registerCommand(command, async () => {
                const config = findConfig();
                await config.update(setting, !config.get(setting), vscode.ConfigurationTarget.Workspace);
            })
        );
    }
}

export function deactivate() { }
