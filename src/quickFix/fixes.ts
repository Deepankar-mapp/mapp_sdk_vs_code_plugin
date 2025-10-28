import * as vscode from 'vscode';

export interface Fix {
    title: string;
    edit: vscode.WorkspaceEdit;
    isPreferred?: boolean;
}

export class FixesManager {
    static async createInitializationFix(
        document: vscode.TextDocument,
        range: vscode.Range
    ): Promise<Fix> {
        const edit = new vscode.WorkspaceEdit();
        edit.replace(
            document.uri,
            range,
            `engage(
    sdkKey: "your-sdk-key",
    googleProjectId: "your-project-id",
    server: "your-server-url",
    appId: "your-app-id",
    tenantId: "your-tenant-id"
)`
        );

        return {
            title: 'Add proper Mapp SDK initialization',
            edit,
            isPreferred: true
        };
    }

    static async createErrorHandlingFix(
        document: vscode.TextDocument,
        range: vscode.Range
    ): Promise<Fix> {
        const edit = new vscode.WorkspaceEdit();
        edit.replace(
            document.uri,
            range,
            `try {
    await MappSdk.methodName();
} catch (error) {
    print('Mapp SDK error: $error');
}`
        );

        return {
            title: 'Add error handling',
            edit,
            isPreferred: true
        };
    }
}