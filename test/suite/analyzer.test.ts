import * as assert from 'assert';
import * as vscode from 'vscode';
import { MappAnalyzer } from '../../src/analyzer/codeAnalyzer';

suite('Code Analyzer Test Suite', () => {
    let analyzer: MappAnalyzer;

    setup(() => {
        analyzer = new MappAnalyzer();
    });

    test('Should detect missing initialization', async () => {
        const testCode = `
            void main() {
                MappSdk.setAlias("test");
            }
        `;
        
        const document = await vscode.workspace.openTextDocument({
            content: testCode,
            language: 'dart'
        });

        const diagnostics = await analyzer.analyzeFile(document);
        assert.strictEqual(diagnostics.length, 1);
        assert.strictEqual(diagnostics[0].severity, 'error');
    });

    test('Should validate correct initialization', async () => {
        const testCode = `
            void main() {
                engage("key", "projectId", "server", "appId", "tenantId");
                MappSdk.setAlias("test");
            }
        `;
        
        const document = await vscode.workspace.openTextDocument({
            content: testCode,
            language: 'dart'
        });

        const diagnostics = await analyzer.analyzeFile(document);
        assert.strictEqual(diagnostics.length, 0);
    });
});