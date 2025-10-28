export interface DiagnosticData {
    message: string;
    severity: DiagnosticSeverity;
    code: string;
    range: {
        start: { line: number; character: number; };
        end: { line: number; character: number; };
    };
    source: string;
    relatedInformation?: DiagnosticRelatedInformation[];
}

export enum DiagnosticSeverity {
    Error = 0,
    Warning = 1,
    Information = 2,
    Hint = 3
}

export interface DiagnosticRelatedInformation {
    location: {
        uri: string;
        range: {
            start: { line: number; character: number; };
            end: { line: number; character: number; };
        };
    };
    message: string;
}