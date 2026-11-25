// pure helpers kept free of the vscode module so they can be unit tested

export interface HideConfig {
    autoHideReferences?: boolean;
    autoHidePanel?: boolean;
    autoHideSideBar?: boolean;
    autoHideAuxiliaryBar?: boolean;
    // lets vscode's WorkspaceConfiguration be passed in directly
    readonly [key: string]: unknown;
}

export interface ClickInfo {
    fromMouse: boolean;
    selections: readonly { isEmpty: boolean }[];
    fileName: string;
    scheme: string;
}

export function findHideCommands(config: HideConfig): string[] {
    const commands: string[] = [];

    if (config.autoHideReferences) {
        commands.push("closeReferenceSearch");
    }
    if (config.autoHidePanel) {
        commands.push("workbench.action.closePanel");
    }
    if (config.autoHideSideBar) {
        commands.push("workbench.action.closeSidebar");
    }
    if (config.autoHideAuxiliaryBar) {
        commands.push("workbench.action.closeAuxiliaryBar");
    }

    return commands;
}

export function isPlainClick(click: ClickInfo): boolean {
    const { fileName } = click;
    // editors without a real path, such as the debug console
    const pathIsFile = fileName.includes(".") || fileName.includes("\\") || fileName.includes("/");

    return (
        click.fromMouse &&
        click.selections.length === 1 &&
        click.selections[0].isEmpty && // false when a drag or shift click selected text
        pathIsFile &&
        click.scheme !== "output"
    );
}
