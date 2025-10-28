export const ANALYSIS_PROMPT = `
Analyze the following Mapp SDK implementation and provide suggestions:
CODE: {{code}}
Focus on:
1. Initialization correctness
2. Method usage
3. Best practices
4. Error handling
`;

export const CODE_ASSISTANCE_PROMPT = `
Help implement the following Mapp SDK functionality:
REQUIREMENT: {{requirement}}
Consider:
1. Official documentation guidelines
2. Error handling
3. Performance optimization
4. User experience
`;

export const QUICK_FIX_PROMPT = `
Suggest a fix for the following Mapp SDK issue:
CODE: {{code}}
ISSUE: {{issue}}
Provide a solution that follows Mapp's best practices.
`;