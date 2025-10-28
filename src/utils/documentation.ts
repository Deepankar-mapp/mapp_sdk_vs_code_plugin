import * as fs from 'fs';
import * as path from 'path';

export class DocumentationManager {
    private apiReference: any;

    constructor() {
        this.loadApiReference();
    }

    private loadApiReference() {
        const apiPath = path.join(__dirname, '../../resources/documentation/api-reference.json');
        try {
            this.apiReference = JSON.parse(fs.readFileSync(apiPath, 'utf8'));
        } catch (error) {
            console.error('Failed to load API reference:', error);
            this.apiReference = {};
        }
    }

    getMethodDocumentation(methodName: string): string {
        return this.apiReference[methodName] || 'Documentation not found';
    }

    getImplementationExample(methodName: string): string {
        return this.apiReference[`${methodName}_example`] || 'Example not found';
    }

    getBestPractices(): string[] {
        return this.apiReference.bestPractices || [];
    }
}