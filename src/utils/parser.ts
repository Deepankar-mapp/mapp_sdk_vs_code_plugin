import * as vscode from 'vscode';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

export class CodeParser {
    static parseCode(sourceCode: string) {
        try {
            return parse(sourceCode, {
                sourceType: 'module',
                plugins: ['typescript', 'jsx']
            });
        } catch (error) {
            console.error('Parse error:', error);
            return null;
        }
    }

    static findMappCalls(ast: any): t.CallExpression[] {
        const mappCalls: t.CallExpression[] = [];

        traverse(ast, {
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

    static findEngageCall(ast: any): t.CallExpression | null {
        let engageCall: t.CallExpression | null = null;

        traverse(ast, {
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