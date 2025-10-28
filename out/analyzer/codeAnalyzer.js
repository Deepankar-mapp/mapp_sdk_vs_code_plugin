"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappAnalyzer = void 0;
const traverse_1 = require("@babel/traverse");
const t = require("@babel/types");
const mappDocumentation_1 = require("../data/mappDocumentation");
class MappAnalyzer {
    checkInitialization(ast) {
        let hasProperInit = false;
        (0, traverse_1.default)(ast, {
            CallExpression: (path) => {
                if (t.isIdentifier(path.node.callee) &&
                    path.node.callee.name === 'engage') {
                    // Check if all required parameters are present
                    const params = path.node.arguments;
                    const requiredParams = [
                        'sdkKey',
                        'googleProjectId',
                        'server',
                        'appId',
                        'tenantId'
                    ];
                    // Check if we have all required parameters
                    if (params.length >= requiredParams.length) {
                        hasProperInit = true;
                    }
                    // If using named parameters (object), check each required parameter
                    if (params.length === 1 && t.isObjectExpression(params[0])) {
                        const properties = params[0].properties;
                        const providedParams = properties.map((prop) => {
                            if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
                                return prop.key.name;
                            }
                            return '';
                        });
                        hasProperInit = requiredParams.every(param => providedParams.includes(param));
                    }
                }
            }
        });
        return hasProperInit;
    }
    async analyzeFile(document) {
        const text = document.getText();
        const issues = [];
        // Improved function detection patterns
        const functionPatterns = {
            handledPushOpen: /MappSdk\.handledPushOpen\s*\(\s*\)/,
            isReady: /MappSdk\.isReady\s*\(\s*\)/,
            getAlias: /MappSdk\.getAlias\s*\(\s*\)/,
            setAlias: /MappSdk\.setAlias\s*\(\s*['"][^'"]*['"]\s*\)/,
            isPushEnabled: /MappSdk\.isPushEnabled\s*\(\s*\)/,
            setPushEnabled: /MappSdk\.setPushEnabled\s*\(\s*(?:true|false)\s*\)/
        };
        // Check for actual implementations
        const foundFunctions = new Set();
        for (const [funcName, pattern] of Object.entries(functionPatterns)) {
            if (pattern.test(text)) {
                foundFunctions.add(funcName);
            }
        }
        // Only report truly missing functions
        const requiredFunctions = new Set([
            'handledPushOpen',
            'isReady',
            'getAlias',
            'setAlias',
            'isPushEnabled',
            'setPushEnabled'
        ]);
        // Consider function implementations in imports or references
        const hasImport = text.includes('import');
        const hasMappReference = text.includes('MappSdk');
        if (hasMappReference) {
            requiredFunctions.forEach(func => {
                // Only flag as missing if we're in a relevant file and the function is truly absent
                if (!foundFunctions.has(func) && !text.includes(`MappSdk.${func}`)) {
                    issues.push({
                        severity: 'warning',
                        message: `Missing required Mapp SDK function: ${func}`,
                        line: 0
                    });
                }
            });
        }
        return issues;
    }
    checkMethodUsage(ast) {
        const issues = [];
        (0, traverse_1.default)(ast, {
            CallExpression(path) {
                if (t.isMemberExpression(path.node.callee) &&
                    t.isIdentifier(path.node.callee.object) &&
                    path.node.callee.object.name === 'MappSdk') {
                    const methodName = path.node.callee.property.name;
                    // Fix the indexing error by type checking
                    const methodDoc = mappDocumentation_1.MAPP_SDK_DOCUMENTATION.methods[methodName];
                    if (methodDoc) {
                        const paramCount = path.node.arguments.length;
                        const requiredParamCount = Object.keys(methodDoc.parameters).length;
                        if (paramCount < requiredParamCount) {
                            issues.push({
                                severity: 'error',
                                message: `Method ${methodName} requires ${requiredParamCount} parameters`,
                                line: path.node.loc?.start.line || 0,
                                column: path.node.loc?.start.column || 0,
                                source: 'mapp-analyzer',
                                suggestion: methodDoc.example
                            });
                        }
                    }
                }
            }
        });
        return issues;
    }
    checkErrorHandling(ast) {
        const issues = [];
        (0, traverse_1.default)(ast, {
            CallExpression: (path) => {
                if (this.isMappSdkCall(path.node)) {
                    const hasTryCatch = this.isInTryCatch(path);
                    if (!hasTryCatch) {
                        issues.push({
                            severity: 'warning',
                            message: 'Mapp SDK call should be wrapped in try-catch block',
                            line: path.node.loc?.start.line || 0,
                            column: path.node.loc?.start.column || 0,
                            source: 'mapp-analyzer',
                            suggestion: mappDocumentation_1.MAPP_SDK_DOCUMENTATION.errorHandling.example
                        });
                    }
                }
            }
        });
        return issues;
    }
    isMappSdkCall(node) {
        return t.isMemberExpression(node.callee) &&
            t.isIdentifier(node.callee.object) &&
            node.callee.object.name === 'MappSdk';
    }
    isInTryCatch(path) {
        let current = path;
        while (current) {
            if (t.isTryStatement(current.node)) {
                return true;
            }
            current = current.parentPath;
        }
        return false;
    }
}
exports.MappAnalyzer = MappAnalyzer;
//# sourceMappingURL=codeAnalyzer.js.map