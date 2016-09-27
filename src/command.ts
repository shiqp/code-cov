'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { KarmaServer } from './common/KarmaServer';

const server: KarmaServer = new KarmaServer();
const rootPath: string = vscode.workspace.rootPath;

export function markAllCodes() {
    if (!rootPath) {
        vscode.window.showErrorMessage('Could not find any projects.');
        return;
    }

    process.chdir(rootPath);
    server.markCodeCovAndSubscribeEvent(rootPath);
}

export function clearAllMarks() {
    server.clearMarksAndSubscriptions();
}

export function configKarma() {
    var configFile = path.resolve(__dirname, '../../karma.conf.js');

    if (!fs.existsSync(configFile)) {
        vscode.window.showErrorMessage(`Could not find ${configFile}`);
        return;
    }

    vscode.workspace
        .openTextDocument(configFile)
        .then(doc => vscode.window.showTextDocument(doc));
}