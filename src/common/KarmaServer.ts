import * as vscode from 'vscode';
import * as karma from 'karma';
import * as path from 'path';
import * as fs from 'fs';

import * as cov from './ICoverageInfo';
import { Marker } from './Marker';

export class KarmaServer {
    private _server: karma.Server;
    private _output: vscode.OutputChannel;
    private _marker: Marker;
    private _subscription: vscode.Disposable;
    private _handlers: number[];

    public constructor() {
        this._output = vscode.window.createOutputChannel('CodeCov');
        this._marker = new Marker();
        this._handlers = [];
    }

    public markCodeCovAndSubscribeEvent(rootPath: string): void {
        this.clearMarksAndSubscriptions();
        this._output.show();
        this._output.clear();

        const covDataPath: string = path.join(rootPath, 'coverage/coverage.json');
        if (fs.existsSync(covDataPath)) {
            fs.unlinkSync(covDataPath);
        }

        if (this._isOnService()) {
            this._runTest(covDataPath);
        } else {
            this._runServer(rootPath, covDataPath);
        }
    }

    public clearMarksAndSubscriptions(): void {
        this._marker.clearAllMarks();
        if (this._subscription) {
            this._subscription.dispose();
        }
    }

    private _isOnService(): boolean {
        if (this._server) {
            return true;
        } else {
            return false;
        }
    }

    private _runServer(rootPath: string, covDataPath: string): void {
        const configFile: string = path.resolve(__dirname, '../../../karma.conf.js');
        this._server = new karma.Server({ configFile: configFile }, (code: number) => {
            this._server = undefined;
        });

        this._server.on('spec_complete', (browser, result) => {
            if (!result.success) {
                for (const suite of result.suite) {
                    this._output.append(suite + '/');
                }
                this._output.appendLine(result.description + ' fail');

                for (const log of result.log) {
                    this._output.appendLine('    ' + log);
                }
                this._output.appendLine('');
            }
        });

        this._server.on('listening', (port) => {
            this._output.appendLine(this._getTime() + ' Karma server started at http://localhost:'+ port +'/');
        });

        this._server.on('browser_register', (browser) => {
            this._output.appendLine(this._getTime() + ' ' + browser.name + ' registed');
            this._runTest(covDataPath);
        });

        this._server.start();
    }

    private _runTest(covDataPath: string) {
        this._output.appendLine(this._getTime() + ' Start to run tests...');
        const runner: karma.Runner = karma.runner;
        const port: number = this._server.get('config').port;
        runner.run({ port: port }, (code: number) => {
            if (code !== 0) {
                this._output.appendLine(this._getTime() + ' Complete with failed tests');
                return;
            }
            
            this._handlers.push(setInterval(() => {
                if (fs.existsSync(covDataPath)) {
                    const covData: cov.ICoverageInfo = JSON.parse(fs.readFileSync(covDataPath, 'utf8'));
                    this._marker.markCovInfo(covData, vscode.window.activeTextEditor);

                    this._subscription = vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor) => {
                        this._marker.markCovInfo(covData, e);
                    });
                    
                    this._handlers.forEach((handler: number) => {
                        clearInterval(handler);
                    });

                    this._handlers = [];

                    this._output.appendLine(this._getTime() + ' Complete');
                }
            }, 500));
        });
    }

    private _getTime(): string {
        const date: Date = new Date();
        const dates: number[] = [];
        const times: number[] = [];
        dates.push(date.getFullYear());
        dates.push(date.getMonth() + 1);
        dates.push(date.getDate());
        times.push(date.getHours());
        times.push(date.getMinutes());
        times.push(date.getSeconds());

        return '[' + dates.join('-') + ' ' + times.join(':') + ']';
    }

}
