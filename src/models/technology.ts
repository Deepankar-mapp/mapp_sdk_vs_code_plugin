export type SupportedTechnology = 
    | 'flutter'
    | 'react-native'
    | 'android-kotlin'
    | 'android-java'
    | 'ios-objc'
    | 'ios-swift';

export interface TechnologyRules {
    name: string;
    fileExtensions: string[];
    documentation: {
        initialization: {
            required: boolean;
            method: string;
            parameters: Record<string, {
                type: string;
                required: boolean;
                description: string;
                validValues?: string[];
            }>;
            example: string;
        };
        methods: Record<string, {
            required: boolean;
            parameters: Record<string, any>;
            example: string;
            requiresInitialization: boolean;
            description: string;
        }>;
        bestPractices: string[];
        errorHandling: {
            recommendations: string[];
            example: string;
        };
        requiredMethods: string[];
    };
    methodPatterns: Record<string, RegExp>;
    codeExamples: Record<string, string>;
}