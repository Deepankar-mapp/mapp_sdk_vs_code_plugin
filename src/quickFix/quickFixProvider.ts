import * as vscode from 'vscode';
import { MappAIAssistant } from '../ai/assistant';

interface QuickFix {
    title: string;
    description: string;
    code: string;
}

export class QuickFixProvider implements vscode.CodeActionProvider {
    constructor(private aiAssistant: MappAIAssistant) {}

    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];

    async provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.CodeAction[]> {
        const diagnostics = context.diagnostics
            .filter(diagnostic => diagnostic.source === 'mapp-analyzer');

        if (diagnostics.length === 0) {
            return [];
        }

        const actions: vscode.CodeAction[] = [];

        for (const diagnostic of diagnostics) {
            const fix = await this.aiAssistant.getQuickFix(
                document.getText(diagnostic.range),
                diagnostic.message
            );

            const action = new vscode.CodeAction(
                'Fix Mapp SDK issue',
                vscode.CodeActionKind.QuickFix
            );
            action.edit = new vscode.WorkspaceEdit();
            action.edit.replace(
                document.uri,
                diagnostic.range,
                fix
            );
            action.diagnostics = [diagnostic];
            action.isPreferred = true;
            actions.push(action);
        }

        return actions;
    }
}