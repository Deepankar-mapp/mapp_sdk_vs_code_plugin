import * as vscode from 'vscode';
import { MappAnalyzer } from './analyzer/codeAnalyzer';
import { MappAIAssistant } from './ai/assistant';
import { AnalysisResultPanel } from './ui/analysisPanel';
import { QuickFixProvider } from './quickFix/quickFixProvider';
import { ProgressIndicator } from './ui/progress';
import { MAPP_SDK_DOCUMENTATION } from './data/mappDocumentation';

export function activate(context: vscode.ExtensionContext) {
    console.log('Mapp Analyzer is now active!');

    const analyzer = new MappAnalyzer();
    const aiAssistant = new MappAIAssistant();
    
    let analyzeCommand = vscode.commands.registerCommand('mapp-analyzer.analyze', async () => {
        try {
            return await ProgressIndicator.show('Analyzing Mapp SDK Implementation', async () => {
                ProgressIndicator.updateMessage('Scanning project files...');
                const files = await vscode.workspace.findFiles('**/*.{dart,tsx,ts,js}');
                
                if (files.length === 0) {
                    vscode.window.showWarningMessage('No suitable files found for analysis');
                    return;
                }
                
                // Collect all relevant code
                let projectCode = '';
                let results = [];
                
                ProgressIndicator.updateMessage('Analyzing project files...');
                for (const file of files) {
                    const document = await vscode.workspace.openTextDocument(file);
                    const fileContent = document.getText();
                    
                    if (fileContent.includes('MappSdk') || 
                        fileContent.includes('engage(') || 
                        fileContent.includes('Mapp')) {
                        projectCode += `\n// File: ${file.fsPath}\n${fileContent}\n`;
                        
                        const fileResults = await analyzer.analyzeFile(document);
                        if (fileResults.length > 0) {
                            results.push({
                                file: file.fsPath,
                                issues: fileResults
                            });
                        }
                    }
                }

                if (!projectCode.trim()) {
                    vscode.window.showWarningMessage('No Mapp SDK code found in the project');
                    return;
                }

                ProgressIndicator.updateMessage('Running AI analysis...');
                const analysis = await aiAssistant.analyzeCode(projectCode);
                
                ProgressIndicator.updateMessage('Generating suggestions...');
                const suggestions = await aiAssistant.getSuggestions(analysis);

                // Combine analyzer results with AI analysis
                const combinedResults = [
                    ...results,
                    {
                        file: 'AI Analysis',
                        issues: [
                            ...analysis.criticalIssues.map(issue => ({
                                severity: 'warning',
                                message: issue,
                                suggestion: null
                            })),
                            ...analysis.missingImplementations.map(missing => ({
                                severity: 'info',
                                message: missing,
                                suggestion: null
                            }))
                        ]
                    }
                ];

                ProgressIndicator.updateMessage('Preparing results...');
                AnalysisResultPanel.show(
                    combinedResults.filter(r => r.issues && r.issues.length > 0),
                    suggestions.filter(s => s && s.length > 0)
                );
                
                if (!analysis.criticalIssues.length && !analysis.improvements.length) {
                    vscode.window.showWarningMessage('No Mapp SDK implementation found. Please add Mapp SDK to your project.');
                } else {
                    const issueCount = analysis.criticalIssues.filter(i => i !== 'No critical issues found').length;
                    const improvementCount = analysis.improvements.filter(i => i !== 'No improvements suggested').length;
                    vscode.window.showInformationMessage(
                        `Analysis completed: Found ${issueCount} issues and ${improvementCount} possible improvements`
                    );
                }
            });
        } catch (error) {
            console.error('Analysis failed:', error);
            vscode.window.showErrorMessage(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });

    let helpCommand = vscode.commands.registerCommand('mapp-analyzer.getHelp', async () => {
        try {
            const panel = vscode.window.createWebviewPanel(
                'mappHelp',
                'Mapp SDK Implementation Guide',
                vscode.ViewColumn.One,
                { enableScripts: true }
            );

            panel.webview.html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { padding: 20px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
                        h2 { color:rgb(255, 255, 255); }
                        .section { margin-bottom: 20px; }
                        code { background-color:rgb(111, 155, 153); padding: 2px 4px; border-radius: 3px; }
                        pre { background-color:rgb(68, 68, 68); padding: 15px; border-radius: 5px; }
                        .important { color: #e74c3c; }
                    </style>
                </head>
                <body>
                    <h2>Mapp SDK Implementation Guide</h2>
                    
                    <div class="section">
                        <h3>Required Steps</h3>
                        <ol>
                            ${MAPP_SDK_DOCUMENTATION.implementationSteps.map(step => 
                                `<li>${step}</li>`).join('\n')}
                        </ol>
                    </div>

                    <div class="section">
                        <h3>Required Methods</h3>
                        <ul>
                            <li><code>MappSdk.isReady()</code> - Check device registration</li>
                            <li><code>MappSdk.getAlias()</code> - Get device alias</li>
                            <li><code>MappSdk.setAlias(String)</code> - Set device alias</li>
                            <li><code>MappSdk.isPushEnabled()</code> - Check push status</li>
                            <li><code>MappSdk.setPushEnabled(boolean)</code> - Enable/disable push</li>
                            <li><code>MappSdk.handledPushOpen()</code> - Handle push opens</li>
                        </ul>
                    </div>

                    <div class="section">
                        <h3>Initialization Example</h3>
                        <pre><code>${MAPP_SDK_DOCUMENTATION.initialization.example}</code></pre>
                    </div>

                    <div class="section">
                        <h3>Best Practices</h3>
                        <ul>
                            ${MAPP_SDK_DOCUMENTATION.bestPractices.map(practice => 
                                `<li>${practice}</li>`).join('\n')}
                        </ul>
                    </div>

                    <div class="section">
                        <h3>Error Handling</h3>
                        <pre><code>${MAPP_SDK_DOCUMENTATION.errorHandling.example}</code></pre>
                    </div>

                    <div class="section">
                        <h3>Need More Help?</h3>
                        <p>Refer to the <a href="https://mapp-wiki.atlassian.net/wiki/spaces/MIC/pages/1712357384/Flutter+Bridge+API+calls+Mapp+Cloud">official Mapp documentation</a> or contact Mapp Support.</p>
                    </div>
                </body>
                </html>
            `;
        } catch (error) {
            vscode.window.showErrorMessage('Failed to open help documentation');
        }
    });

    context.subscriptions.push(analyzeCommand, helpCommand);
}

export function deactivate() {}