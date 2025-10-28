"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentationManager = void 0;
const fs = require("fs");
const path = require("path");
class DocumentationManager {
    constructor() {
        this.loadApiReference();
    }
    loadApiReference() {
        const apiPath = path.join(__dirname, '../../resources/documentation/api-reference.json');
        try {
            this.apiReference = JSON.parse(fs.readFileSync(apiPath, 'utf8'));
        }
        catch (error) {
            console.error('Failed to load API reference:', error);
            this.apiReference = {};
        }
    }
    getMethodDocumentation(methodName) {
        return this.apiReference[methodName] || 'Documentation not found';
    }
    getImplementationExample(methodName) {
        return this.apiReference[`${methodName}_example`] || 'Example not found';
    }
    getBestPractices() {
        return this.apiReference.bestPractices || [];
    }
}
exports.DocumentationManager = DocumentationManager;
//# sourceMappingURL=documentation.js.map