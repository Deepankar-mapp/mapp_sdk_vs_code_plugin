"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickFixesUI = void 0;
const vscode = require("vscode");
class QuickFixesUI {
    constructor(aiAssistant) {
        this.aiAssistant = aiAssistant;
    }
    async showQuickFix(document, range, issue) {
        const fix = await this.aiAssistant.getQuickFix(document.getText(range), issue);
        if (fix) {
            const edit = new vscode.WorkspaceEdit();
            edit.replace(document.uri, range, fix);
            await vscode.workspace.applyEdit(edit);
        }
    }
}
exports.QuickFixesUI = QuickFixesUI;
//# sourceMappingURL=quickFixes.js.map