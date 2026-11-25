import { test } from "node:test";
import * as assert from "node:assert/strict";
import { ClickInfo, findHideCommands, isPlainClick } from "../src/hide";

const plainClick: ClickInfo = {
    fromMouse: true,
    selections: [{ isEmpty: true }],
    fileName: "/home/user/project/main.ts",
    scheme: "file",
};

test("findHideCommands returns nothing when everything is disabled", () => {
    assert.deepEqual(findHideCommands({}), []);
});

test("findHideCommands returns every command when everything is enabled", () => {
    const commands = findHideCommands({
        autoHideReferences: true,
        autoHidePanel: true,
        autoHideSideBar: true,
        autoHideAuxiliaryBar: true,
    });

    assert.deepEqual(commands, [
        "closeReferenceSearch",
        "workbench.action.closePanel",
        "workbench.action.closeSidebar",
        "workbench.action.closeAuxiliaryBar",
    ]);
});

test("findHideCommands only includes enabled parts", () => {
    assert.deepEqual(
        findHideCommands({ autoHidePanel: true, autoHideSideBar: false }),
        ["workbench.action.closePanel"]
    );
});

test("findHideCommands keeps the side bar while debugging when configured", () => {
    const config = { autoHideSideBar: true, autoHidePanel: true, keepSideBarWhileDebugging: true };

    assert.deepEqual(findHideCommands(config, true), ["workbench.action.closePanel"]);
    assert.deepEqual(findHideCommands(config, false), [
        "workbench.action.closePanel",
        "workbench.action.closeSidebar",
    ]);
});

test("findHideCommands hides the side bar while debugging by default", () => {
    assert.deepEqual(findHideCommands({ autoHideSideBar: true }, true), ["workbench.action.closeSidebar"]);
});

test("isPlainClick accepts a mouse click in a file", () => {
    assert.equal(isPlainClick(plainClick), true);
});

test("isPlainClick accepts windows paths", () => {
    assert.equal(isPlainClick({ ...plainClick, fileName: "C:\\project\\main.ts" }), true);
});

test("isPlainClick rejects untitled editors because the name has no path", () => {
    assert.equal(isPlainClick({ ...plainClick, fileName: "Untitled-1", scheme: "untitled" }), false);
});

test("isPlainClick rejects keyboard and command selection changes", () => {
    assert.equal(isPlainClick({ ...plainClick, fromMouse: false }), false);
});

test("isPlainClick rejects a click that selects text", () => {
    assert.equal(isPlainClick({ ...plainClick, selections: [{ isEmpty: false }] }), false);
});

test("isPlainClick rejects multiple cursors and no selection", () => {
    assert.equal(isPlainClick({ ...plainClick, selections: [{ isEmpty: true }, { isEmpty: true }] }), false);
    assert.equal(isPlainClick({ ...plainClick, selections: [] }), false);
});

test("isPlainClick rejects editors without a real path", () => {
    assert.equal(isPlainClick({ ...plainClick, fileName: "debug" }), false);
});

test("isPlainClick rejects the output panel", () => {
    assert.equal(isPlainClick({ ...plainClick, scheme: "output" }), false);
});
