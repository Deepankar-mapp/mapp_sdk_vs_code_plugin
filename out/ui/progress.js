"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressIndicator = void 0;
const vscode = require("vscode");
class ProgressIndicator {
    static async show(title, task) {
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
            }
            finally {
                this.currentProgress = undefined;
            }
        });
    }
    static updateMessage(message) {
        if (this.currentProgress) {
            this.currentProgress.report({ message });
        }
    }
}
exports.ProgressIndicator = ProgressIndicator;
//# sourceMappingURL=progress.js.map