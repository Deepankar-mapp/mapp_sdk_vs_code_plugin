export interface AnalysisResult {
    file: string;
    issues: Issue[];
    metrics: CodeMetrics;
    suggestions: Suggestion[];
}

export interface Issue {
    type: 'error' | 'warning' | 'info';
    message: string;
    line: number;
    column: number;
    code: string;
    suggestedFix?: string;
}

export interface CodeMetrics {
    initializationQuality: number;
    errorHandlingQuality: number;
    bestPracticesScore: number;
    overallScore: number;
}

export interface Suggestion {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    codeExample?: string;
}