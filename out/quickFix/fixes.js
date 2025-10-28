"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixesManager = void 0;
const vscode = require("vscode");
class FixesManager {
    static async createInitializationFix(document, range) {
        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, range, `engage(
    sdkKey: "your-sdk-key",
    googleProjectId: "your-project-id",
    server: "your-server-url",
    appId: "your-app-id",
    tenantId: "your-tenant-id"
)`);
        return {
            title: 'Add proper Mapp SDK initialization',
            edit,
            isPreferred: true
        };
    }
    static async createErrorHandlingFix(document, range) {
        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, range, `try {
    await MappSdk.methodName();
} catch (error) {
    print('Mapp SDK error: $error');
}`);
        return {
            title: 'Add error handling',
            edit,
            isPreferred: true
        };
    }
}
exports.FixesManager = FixesManager;
//# sourceMappingURL=fixes.js.map