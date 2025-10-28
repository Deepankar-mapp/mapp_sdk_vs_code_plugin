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
                model: "gpt-4",
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
                temperature: 0.1
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
                model: "gpt-4",
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
                model: "gpt-4",
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
Analyze this Flutter project's Mapp SDK implementation:

${code}

IMPORTANT: 
- Consider both direct implementations and method references
- Check for function calls in different forms (with/without whitespace)
- Look for implementations across multiple files
- Consider both async/await and Promise-based calls
- Check for function aliases or wrapped implementations

Provide a detailed analysis focusing on these key areas:

1. Required Methods Check:
   - Check for each required method:
     * MappSdk.isReady() - Status: [Found/Missing]
     * MappSdk.getAlias() - Status: [Found/Missing]
     * MappSdk.setAlias() - Status: [Found/Missing]
     * MappSdk.isPushEnabled() - Status: [Found/Missing]
     * MappSdk.setPushEnabled() - Status: [Found/Missing]
     * MappSdk.handledPushOpen(argument) - Status: [Found/Missing]
        Note: Check for both direct method calls and function assignments like:
        - MappSdk.handledPushOpen(argument)
        - MappSdk.handledPushOpen = (arguments) => handler(arguments)
   - For each missing method, provide exact implementation needed

2. Push Notification Implementation:
   - Check for conflicting providers (OneSignal, etc.)
   - Verify push handling implementation
   - List any missing push notification setup

3. Geolocation Features (if applicable):
   - Location permissions status
   - MappSdk.startGeoFencing() implementation
   - MappSdk.stopGeoFencing() implementation

4. Initialization and Error Handling:
   - Verify engage() method parameters
   - Check try-catch implementation
   - Verify initialization order

For each issue found, provide:
- File: [filename]
- Line: [line number if available]
- Issue: [description]
- Fix: [exact code needed]
- Priority: [Critical/Warning/Info]

Use bullet points (-) for listing issues and findings.
`;
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
            console.log('Starting to parse response');
            // Split by numbered sections
            const sections = response.split(/\d+\./);
            // Extract information from each section
            const requiredMethodsSection = sections.find(s => s.includes('Required Methods Check')) || '';
            const pushSection = sections.find(s => s.includes('Push Notification Implementation')) || '';
            const geoSection = sections.find(s => s.includes('Geolocation Features')) || '';
            const initSection = sections.find(s => s.includes('Initialization and Error Handling')) || '';
            // Parse issues from each section
            const criticalIssues = [];
            const improvements = [];
            const missingImplementations = [];
            const securityConcerns = [];
            // Extract bullet points from each section
            const extractBulletPoints = (text) => text.split('\n')
                .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
                .map(line => line.trim().replace(/^[-*]\s*/, ''));
            // Process required methods
            const methodIssues = extractBulletPoints(requiredMethodsSection);
            methodIssues.forEach(issue => {
                if (issue.toLowerCase().includes('missing')) {
                    missingImplementations.push(issue);
                }
            });
            // Process push notification issues
            const pushIssues = extractBulletPoints(pushSection);
            pushIssues.forEach(issue => {
                if (issue.toLowerCase().includes('conflict')) {
                    criticalIssues.push(`Critical: ${issue}`);
                }
                else if (issue.toLowerCase().includes('missing')) {
                    missingImplementations.push(issue);
                }
                else {
                    improvements.push(issue);
                }
            });
            // Process initialization issues
            const initIssues = extractBulletPoints(initSection);
            initIssues.forEach(issue => {
                if (issue.toLowerCase().includes('missing') ||
                    issue.toLowerCase().includes('required')) {
                    criticalIssues.push(issue);
                }
                else {
                    improvements.push(issue);
                }
            });
            // If no issues found but code exists, add default message
            if (criticalIssues.length === 0 &&
                missingImplementations.length === 0 &&
                improvements.length === 0) {
                return {
                    criticalIssues: ['Implementation check required: Please verify Mapp SDK integration'],
                    improvements: ['Consider implementing additional Mapp SDK features'],
                    missingImplementations: ['Verify all required methods are implemented'],
                    securityConcerns: []
                };
            }
            return {
                criticalIssues: criticalIssues.length > 0 ? criticalIssues : ['No critical issues found'],
                improvements: improvements.length > 0 ? improvements : ['No improvements needed'],
                missingImplementations: missingImplementations.length > 0 ? missingImplementations : ['No missing implementations detected'],
                securityConcerns: securityConcerns
            };
        }
        catch (error) {
            console.error('Failed to parse AI response:', error);
            return {
                criticalIssues: ['Analysis parsing error - please try again'],
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
}
exports.MappAIAssistant = MappAIAssistant;
//# sourceMappingURL=assistant.js.map