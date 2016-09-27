'use strict';
import * as vscode from 'vscode';
import * as cmd from './command';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "code-cov-js" is now active!');

    let subscriptions = context.subscriptions;
    
    subscriptions.push(vscode.commands.registerCommand('codecov.mark', function () {
        try {
            cmd.markAllCodes();
        } catch (error) {
            console.error(error);
        }
    }));

    subscriptions.push(vscode.commands.registerCommand('codecov.clear', function () {
        try {
            cmd.clearAllMarks();
        } catch (error) {
            console.error(error);
        }
    }));

    subscriptions.push(vscode.commands.registerCommand('codecov.config', function () {
        try {
            cmd.configKarma();
        } catch (error) {
            console.error(error);
        }
    }));
}

export function deactivate() {
}