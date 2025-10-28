"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBarManager = exports.createStatusBarItem = void 0;
const vscode = require("vscode");
function createStatusBarItem(text) {
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = text;
    statusBarItem.command = 'mapp-analyzer.analyze';
    statusBarItem.tooltip = 'Analyze Mapp Code';
    statusBarItem.show();
    return statusBarItem;
}
exports.createStatusBarItem = createStatusBarItem;
class StatusBarManager {
    constructor() {
        this.statusBarItem = createStatusBarItem('$(search) Analyze Mapp Code');
    }
    setAnalyzing() {
        this.statusBarItem.text = '$(sync~spin) Analyzing...';
    }
    setReady() {
        this.statusBarItem.text = '$(search) Analyze Mapp Code';
    }
    dispose() {
        this.statusBarItem.dispose();
    }
}
exports.StatusBarManager = StatusBarManager;
//# sourceMappingURL=statusBar.js.map