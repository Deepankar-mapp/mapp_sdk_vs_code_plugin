import * as vscode from 'vscode';

export class AnalysisResultPanel {
    private static currentPanel: AnalysisResultPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    // ✅ Show just the AI response (string or raw text object)
    public static show(result: any) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (AnalysisResultPanel.currentPanel) {
            AnalysisResultPanel.currentPanel._panel.reveal(column);
            AnalysisResultPanel.currentPanel._update(result);
        } else {
            const panel = vscode.window.createWebviewPanel(
                'mappAnalysis',
                'Mapp SDK Analysis Results',
                column || vscode.ViewColumn.One,
                { enableScripts: true }
            );
            AnalysisResultPanel.currentPanel = new AnalysisResultPanel(panel);
            AnalysisResultPanel.currentPanel._update(result);
        }
    }

    private _update(result: any) {
        this._panel.webview.html = this._getHtmlContent(result);
    }

    private _escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    private _getHtmlContent(result: any): string {
        // Handle both string and { rawText: '...' } cases
        const rawText =
            typeof result === 'string'
                ? result
                : typeof result?.rawText === 'string'
                ? result.rawText
                : 'No AI analysis available.';

        const escaped = this._escapeHtml(rawText);

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="Content-Security-Policy"
                    content="default-src 'none'; style-src 'unsafe-inline' ${this._panel.webview.cspSource};">
                <style>
                    :root {
                        --bg: var(--vscode-editor-background);
                        --fg: var(--vscode-editor-foreground);
                        --border: var(--vscode-editorWidget-border);
                        --code-bg: var(--vscode-textCodeBlock-background, #1e1e1e);
                        --font: var(--vscode-editor-font-family, Consolas, 'Courier New', monospace);
                    }
                    body {
                        padding: 20px;
                        color: var(--fg);
                        background: var(--bg);
                        font-family: var(--vscode-font-family, sans-serif);
                        line-height: 1.5;
                    }
                    h2 {
                        margin-bottom: 10px;
                    }
                    pre {
                        white-space: pre-wrap;
                        word-break: break-word;
                        background: var(--code-bg);
                        border: 1px solid var(--border);
                        border-radius: 8px;
                        padding: 14px;
                        font-family: var(--font);
                        font-size: 13px;
                    }
                </style>
            </head>
            <body>
                <h2>AI Analysis</h2>
                <pre>${escaped}</pre>
            </body>
            </html>
        `;
    }

    private constructor(panel: vscode.WebviewPanel) {
        this._panel = panel;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }

    public dispose() {
        AnalysisResultPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
}
