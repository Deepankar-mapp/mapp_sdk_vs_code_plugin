"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappAIAssistant = void 0;
const vscode = require("vscode");
const openai_1 = require("openai");
const mappDocumentation_1 = require("../data/mappDocumentation");
class MappAIAssistant {
    constructor() {
        // Initialize OpenAI with API key from VS Code settings
        const config = vscode.workspace.getConfiguration('mappAnalyzer');
        const apiKey = config.get('openAIKey');
        if (!apiKey) {
            vscode.window.showErrorMessage('Please set your OpenAI API key in settings');
        }
        this.openai = new openai_1.default({
            apiKey: apiKey || process.env.OPENAI_API_KEY
        });
        this.context = `
Mapp SDK Documentation:
1. Initialization Requirements:
${JSON.stringify(mappDocumentation_1.MAPP_SDK_DOCUMENTATION.initialization, null, 2)}

2. Available Methods:
${JSON.stringify(mappDocumentation_1.MAPP_SDK_DOCUMENTATION.methods, null, 2)}

3. Best Practices:
${mappDocumentation_1.MAPP_SDK_DOCUMENTATION.bestPractices.join('\n')}

4. Error Handling:
${JSON.stringify(mappDocumentation_1.MAPP_SDK_DOCUMENTATION.errorHandling, null, 2)}
`;
    }
    async analyzeCode(code) {
        const prompt = this.createAnalysisPrompt(code);
        try {
            console.log('Starting AI analysis with code length:', code.length);
            if (!code.trim()) {
                console.log('No code found to analyze');
                return {
                    criticalIssues: ['No Mapp SDK implementation found in the project'],
                    improvements: [],
                    missingImplementations: ['Complete Mapp SDK implementation is missing'],
                    securityConcerns: []
                };
            }
            // Add more structured system prompt
            const completion = await this.openai.chat.completions.create({
                model: "gpt-5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a Mapp SDK expert analyzing Flutter projects. 
IMPORTANT: Only flag issues that explicitly violate the provided documentation.
Do not suggest changes unless they directly contradict the documentation.
For each potential issue:
1. Check the exact method signature in the documentation
2. Verify parameter types and requirements
3. Only report issues if implementation differs from documentation

Documentation reference: ${this.context}`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.2
            });
            const response = completion.choices[0].message.content || '';
            console.log('Raw AI Response:', response); // Log full response for debugging
            if (!response.trim()) {
                console.log('Empty response from AI');
                return {
                    criticalIssues: ['AI analysis failed to provide results'],
                    improvements: [],
                    missingImplementations: ['Unable to analyze implementation'],
                    securityConcerns: []
                };
            }
            const result = this.parseAnalysisResponse(response);
            console.log('Parsed Analysis Result:', result); // Log parsed result
            return result;
        }
        catch (error) {
            console.error('AI analysis failed:', error);
            return {
                criticalIssues: [`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
                improvements: [],
                missingImplementations: [],
                securityConcerns: []
            };
        }
    }
    async getSuggestions(analysisResult) {
        const prompt = this.createSuggestionsPrompt(analysisResult);
        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a Mapp SDK expert. Provide specific, actionable suggestions to improve the code.
                        Base your suggestions on these best practices: ${JSON.stringify(mappDocumentation_1.MAPP_SDK_DOCUMENTATION.bestPractices)}`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
            });
            return this.parseSuggestions(completion.choices[0].message.content || '');
        }
        catch (error) {
            console.error('AI suggestions failed:', error);
            return [];
        }
    }
    async getQuickFix(code, issue) {
        const prompt = this.createQuickFixPrompt(code, issue);
        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a Mapp SDK expert. Provide code fixes following Mapp's documentation: ${this.context}`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.2,
            });
            return completion.choices[0].message.content || '';
        }
        catch (error) {
            console.error('Quick fix generation failed:', error);
            throw new Error('Failed to generate quick fix');
        }
    }
    createAnalysisPrompt(code) {
        return `
Analyze this Flutter code for Mapp SDK implementation compliance.
Base your analysis ONLY on the provided documentation.

CODE TO ANALYZE:
${code}

REQUIRED CHECKS:

1. SDK Initialization (CRITICAL):
- Search for 'MappSdk.engage(' or '.engage(' calls
- Verify exact parameter count and order: (sdkKey, googleProjectId, server, appId, tenantId)
- Flag if engage() is not found or parameters are incorrect

2. Method Implementation Status:
For each method, indicate:
- [FOUND/MISSING] MappSdk.engage()
- [FOUND/MISSING] MappSdk.isPushEnabled()
- [FOUND/MISSING] MappSdk.setPushEnabled()
- [FOUND/MISSING] MappSdk.handledPushOpen()

3. Method Order & Dependencies:
- Verify engage() is called before other SDK methods
- Check for isReady() calls before SDK operations
- Look for proper async/await usage

4. Error Handling:
- Check for try-catch blocks around SDK calls
- Verify proper error handling patterns

FORMAT YOUR RESPONSE AS FOLLOWS:
Critical Issues:
- <list each critical issue>

Missing Implementations:
- <list missing required methods>

Improvements Needed:
- <list suggested improvements>

Security Concerns:
- <list security issues>

Use exact method names and parameters from the documentation.
Flag ANY deviation from the documentation as an issue.`;
    }
    createSuggestionsPrompt(analysis) {
        return `
Based on this analysis:
${JSON.stringify(analysis, null, 2)}

Provide specific code fixes following Mapp's exact documentation.
For each issue:
1. Show the current problematic code
2. Show the exact corrected code using examples from documentation
3. Explain why this fix matches Mapp's requirements

Focus only on concrete fixes from the documentation, not general suggestions.
`;
    }
    createQuickFixPrompt(code, issue) {
        return `
Fix this Mapp SDK implementation:

Code:
${code}

Issue:
${issue}

Provide a corrected version following Mapp's documentation and best practices.
Include only the fixed code without explanations.
`;
    }
    parseAnalysisResponse(response) {
        try {
            // Initialize result categories
            const result = {
                criticalIssues: [],
                improvements: [],
                missingImplementations: [],
                securityConcerns: []
            };
            // Split response into sections
            const sections = response.split(/\n\n/);
            sections.forEach(section => {
                const lines = section.split('\n');
                lines.forEach(line => {
                    const trimmedLine = line.trim();
                    // Skip empty lines
                    if (!trimmedLine)
                        return;
                    // Check for method status indicators
                    if (trimmedLine.includes('[MISSING]')) {
                        if (trimmedLine.includes('MappSdk.engage')) {
                            result.criticalIssues.push('Missing SDK initialization: MappSdk.engage() not found');
                        }
                        result.missingImplementations.push(trimmedLine);
                    }
                    // Parse specific sections
                    if (section.toLowerCase().includes('critical issues:')) {
                        if (trimmedLine.startsWith('-')) {
                            result.criticalIssues.push(trimmedLine.substring(1).trim());
                        }
                    }
                    else if (section.toLowerCase().includes('improvements needed:')) {
                        if (trimmedLine.startsWith('-')) {
                            result.improvements.push(trimmedLine.substring(1).trim());
                        }
                    }
                    else if (section.toLowerCase().includes('security concerns:')) {
                        if (trimmedLine.startsWith('-')) {
                            result.securityConcerns.push(trimmedLine.substring(1).trim());
                        }
                    }
                });
            });
            // Ensure at least one item in each category
            if (result.criticalIssues.length === 0) {
                result.criticalIssues = ['No critical issues found'];
            }
            if (result.improvements.length === 0) {
                result.improvements = ['No improvements needed'];
            }
            if (result.missingImplementations.length === 0) {
                result.missingImplementations = ['All required methods implemented'];
            }
            if (result.securityConcerns.length === 0) {
                result.securityConcerns = ['No security concerns identified'];
            }
            return result;
        }
        catch (error) {
            console.error('Failed to parse AI response:', error);
            return {
                criticalIssues: ['Analysis parsing error'],
                improvements: [],
                missingImplementations: [],
                securityConcerns: []
            };
        }
    }
    parseSuggestions(response) {
        try {
            return response.split('\n')
                .filter(line => line.trim().startsWith('-'))
                .map(line => line.trim().substring(2));
        }
        catch (error) {
            return [];
        }
    }
    detectSdkMethods(code) {
        const methods = new Set();
        const methodPatterns = [
            /MappSdk\.engage\s*\(/,
            /MappSdk\.isPushEnabled\s*\(/,
            /MappSdk\.setPushEnabled\s*\(/,
            /MappSdk\.handledPushOpen\s*\(/,
            /MappSdk\.isReady\s*\(/
        ];
        methodPatterns.forEach(pattern => {
            if (pattern.test(code)) {
                methods.add(pattern.source.split('\\.')[1].split('\\')[0]);
            }
        });
        return methods;
    }
}
exports.MappAIAssistant = MappAIAssistant;
//# sourceMappingURL=assistant.js.map