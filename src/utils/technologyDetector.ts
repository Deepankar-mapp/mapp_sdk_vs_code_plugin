import { SupportedTechnology } from '../models/technology';
import * as vscode from 'vscode';
import * as path from 'path';

export class TechnologyDetector {
    private static extensionMap: Record<string, SupportedTechnology> = {
        '.dart': 'flutter',
        '.jsx': 'react-native',
        '.tsx': 'react-native',
        '.js': 'react-native',
        '.ts': 'react-native',
        '.kt': 'android-kotlin',
        '.java': 'android-java',
        '.m': 'ios-objc',
        '.h': 'ios-objc',
        '.swift': 'ios-swift'
    };

    static detectTechnology(document: vscode.TextDocument): SupportedTechnology {
        const extension = path.extname(document.fileName).toLowerCase();
        return this.extensionMap[extension] || 'flutter'; // default to flutter
    }
}