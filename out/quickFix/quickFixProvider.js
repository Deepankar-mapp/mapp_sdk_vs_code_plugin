"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickFixProvider = void 0;
const vscode = require("vscode");
class QuickFixProvider {
    constructor(aiAssistant) {
        this.aiAssistant = aiAssistant;
    }
    async provideCodeActions(document, range, context, token) {
        const diagnostics = context.diagnostics
            .filter(diagnostic => diagnostic.source === 'mapp-analyzer');
        if (diagnostics.length === 0) {
            return [];
        }
        const actions = [];
        for (const diagnostic of diagnostics) {
            const fix = await this.aiAssistant.getQuickFix(document.getText(diagnostic.range), diagnostic.message);
            const action = new vscode.CodeAction('Fix Mapp SDK issue', vscode.CodeActionKind.QuickFix);
            action.edit = new vscode.WorkspaceEdit();
            action.edit.replace(document.uri, diagnostic.range, fix);
            action.diagnostics = [diagnostic];
            action.isPreferred = true;
            actions.push(action);
        }
        return actions;
    }
}
exports.QuickFixProvider = QuickFixProvider;
QuickFixProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
//# sourceMappingURL=quickFixProvider.js.map