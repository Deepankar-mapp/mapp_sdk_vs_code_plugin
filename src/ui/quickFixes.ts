import * as vscode from 'vscode';
import { MappAIAssistant } from '../ai/assistant';

export class QuickFixesUI {
    constructor(private aiAssistant: MappAIAssistant) {}

    async showQuickFix(document: vscode.TextDocument, range: vscode.Range, issue: string) {
        const fix = await this.aiAssistant.getQuickFix(document.getText(range), issue);
        
        if (fix) {
            const edit = new vscode.WorkspaceEdit();
            edit.replace(document.uri, range, fix);
            await vscode.workspace.applyEdit(edit);
        }
    }
}