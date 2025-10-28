"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticsManager = void 0;
const vscode = require("vscode");
class DiagnosticsManager {
    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('mapp-analyzer');
    }
    updateDiagnostics(document, diagnostics) {
        const vsDiagnostics = diagnostics.map(this.convertToVSDiagnostic);
        this.diagnosticCollection.set(document.uri, vsDiagnostics);
    }
    convertToVSDiagnostic(info) {
        const range = new vscode.Range(new vscode.Position(info.location.line, info.location.column), new vscode.Position(info.location.line, info.location.column + 1));
        const diagnostic = new vscode.Diagnostic(range, info.message, this.getSeverity(info.severity));
        diagnostic.code = info.code;
        return diagnostic;
    }
    getSeverity(severity) {
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
exports.DiagnosticsManager = DiagnosticsManager;
//# sourceMappingURL=diagnostics.js.map