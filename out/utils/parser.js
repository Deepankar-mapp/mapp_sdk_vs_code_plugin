"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeParser = void 0;
const parser_1 = require("@babel/parser");
const traverse_1 = require("@babel/traverse");
const t = require("@babel/types");
class CodeParser {
    static parseCode(sourceCode) {
        try {
            return (0, parser_1.parse)(sourceCode, {
                sourceType: 'module',
                plugins: ['typescript', 'jsx']
            });
        }
        catch (error) {
            console.error('Parse error:', error);
            return null;
        }
    }
    static findMappCalls(ast) {
        const mappCalls = [];
        (0, traverse_1.default)(ast, {
            CallExpression(path) {
                if (t.isMemberExpression(path.node.callee) &&
                    t.isIdentifier(path.node.callee.object) &&
                    path.node.callee.object.name === 'MappSdk') {
                    mappCalls.push(path.node);
                }
            }
        });
        return mappCalls;
    }
    static findEngageCall(ast) {
        let engageCall = null;
        (0, traverse_1.default)(ast, {
            CallExpression(path) {
                if (t.isIdentifier(path.node.callee) &&
                    path.node.callee.name === 'engage') {
                    engageCall = path.node;
                    path.stop();
                }
            }
        });
        return engageCall;
    }
}
exports.CodeParser = CodeParser;
//# sourceMappingURL=parser.js.map