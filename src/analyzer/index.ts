export * from './codeAnalyzer';
export * from './diagnostics';

export interface AnalysisResult {
    diagnostics: DiagnosticInfo[];
    suggestions: string[];
    codeQuality: CodeQualityMetrics;
}

export interface DiagnosticInfo {
    message: string;
    severity: 'error' | 'warning' | 'info';
    location: {
        file: string;
        line: number;
        column: number;
    };
    code: string;
}

export interface CodeQualityMetrics {
    initializationScore: number;
    methodUsageScore: number;
    errorHandlingScore: number;
    overallScore: number;
}