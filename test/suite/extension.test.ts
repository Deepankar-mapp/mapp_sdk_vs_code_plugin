import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Starting all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('mapp-analyzer'));
    });

    test('Should register all commands', async () => {
        const commands = await vscode.commands.getCommands();
        assert.ok(commands.includes('mapp-analyzer.analyze'));
        assert.ok(commands.includes('mapp-analyzer.getHelp'));
    });

    test('Should activate extension', async () => {
        const ext = vscode.extensions.getExtension('mapp-analyzer');
        await ext?.activate();
        assert.ok(true);
    });
});