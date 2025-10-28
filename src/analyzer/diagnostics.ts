import * as vscode from 'vscode';
import { DiagnosticInfo } from './index';

export class DiagnosticsManager {
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('mapp-analyzer');
    }

    updateDiagnostics(document: vscode.TextDocument, diagnostics: DiagnosticInfo[]) {
        const vsDiagnostics = diagnostics.map(this.convertToVSDiagnostic);
        this.diagnosticCollection.set(document.uri, vsDiagnostics);
    }

    private convertToVSDiagnostic(info: DiagnosticInfo): vscode.Diagnostic {
        const range = new vscode.Range(
            new vscode.Position(info.location.line, info.location.column),
            new vscode.Position(info.location.line, info.location.column + 1)
        );

        const diagnostic = new vscode.Diagnostic(
            range,
            info.message,
            this.getSeverity(info.severity)
        );

        diagnostic.code = info.code;
        return diagnostic;
    }

    private getSeverity(severity: string): vscode.DiagnosticSeverity {
        switch (severity) {
            case 'error':
                return vscode.DiagnosticSeverity.Error;
            case 'warning':
                return vscode.DiagnosticSeverity.Warning;
            default:
                return vscode.DiagnosticSeverity.Information;
        }
    }

    dispose() {
        this.diagnosticCollection.dispose();
    }
}