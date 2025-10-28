import * as vscode from 'vscode';

export class AnalysisResultPanel {
    private static currentPanel: AnalysisResultPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    public static show(results: any[], suggestions: string[]) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (AnalysisResultPanel.currentPanel) {
            AnalysisResultPanel.currentPanel._panel.reveal(column);
            AnalysisResultPanel.currentPanel._update(results, suggestions);
        } else {
            const panel = vscode.window.createWebviewPanel(
                'mappAnalysis',
                'Mapp SDK Analysis Results',
                column || vscode.ViewColumn.One,
                { enableScripts: true }
            );
            AnalysisResultPanel.currentPanel = new AnalysisResultPanel(panel);
            AnalysisResultPanel.currentPanel._update(results, suggestions);
        }
    }

    private _update(results: any[], suggestions: string[]) {
        this._panel.webview.html = this._getHtmlContent(results, suggestions);
    }

    private _getHtmlContent(results: any[], suggestions: string[]): string {
        const issuesHtml = results.map(result => `
            <div class="file-section">
                <h3>${result.file}</h3>
                <ul>
                    ${result.issues.map((issue: any) => `
                        <li class="issue-item">
                            <strong>${issue.severity}:</strong> ${issue.message}
                            ${issue.suggestion ? `<pre><code>${issue.suggestion}</code></pre>` : ''}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');

        const suggestionsHtml = suggestions.map(suggestion => 
            `<li class="suggestion-item">${suggestion}</li>`
        ).join('');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { padding: 20px; }
                    .file-section { margin-bottom: 20px; }
                    .issue-item { margin: 10px 0; }
                    .suggestion-item { margin: 5px 0; }
                    pre { background-color: #f0f0f0; padding: 10px; }
                </style>
            </head>
            <body>
                <h2>Analysis Results</h2>
                ${results.length > 0 ? issuesHtml : '<p>No issues found in implementation.</p>'}
                
                <h2>Suggestions</h2>
                ${suggestions.length > 0 
                    ? `<ul>${suggestionsHtml}</ul>` 
                    : '<p>No suggestions available.</p>'}
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