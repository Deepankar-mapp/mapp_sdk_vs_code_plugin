import * as vscode from 'vscode';

export class ProgressIndicator {
    private static currentProgress: vscode.Progress<{ message?: string; increment?: number }> | undefined;
    private static progressResolver: (() => void) | undefined;

    public static async show(title: string, task: () => Promise<any>): Promise<any> {
        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: title,
            cancellable: false
        }, async (progress) => {
            this.currentProgress = progress;
            
            progress.report({ message: 'Starting analysis...' });
            
            try {
                const result = await task();
                progress.report({ message: 'Completing analysis...' });
                return result;
            } finally {
                this.currentProgress = undefined;
            }
        });
    }

    public static updateMessage(message: string) {
        if (this.currentProgress) {
            this.currentProgress.report({ message });
        }
    }
} 