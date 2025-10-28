import * as vscode from 'vscode';

export function createStatusBarItem(text: string): vscode.StatusBarItem {
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );

    statusBarItem.text = text;
    statusBarItem.command = 'mapp-analyzer.analyze';
    statusBarItem.tooltip = 'Analyze Mapp Code';
    statusBarItem.show();

    return statusBarItem;
}

export class StatusBarManager {
    private statusBarItem: vscode.StatusBarItem;

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