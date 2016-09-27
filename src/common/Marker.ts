import * as vscode from 'vscode';
import * as cov from './ICoverageInfo';
import * as path from 'path';

export class Marker {
    private _unCovLineStyle: vscode.TextEditorDecorationType;
    private _unCovFuncStyle: vscode.TextEditorDecorationType;
    private _covFuncStyle: vscode.TextEditorDecorationType;

    public markCovInfo(covData: cov.ICoverageInfo, activeTextEditor: vscode.TextEditor) {
        if (activeTextEditor) {
            for (const fileName in covData) {
                if (activeTextEditor.document.fileName == fileName) {
                    this._markUnCovLines(covData[fileName].l, activeTextEditor);
                    this._markFunc(covData[fileName].f, covData[fileName].fnMap, activeTextEditor);
                    break;
                }
            }
        }
    }

    public clearAllMarks() {
        if (this._unCovLineStyle) {
            this._unCovLineStyle.dispose();
        }

        if (this._unCovFuncStyle) {
            this._unCovFuncStyle.dispose();
        }

        if (this._covFuncStyle) {
            this._covFuncStyle.dispose();
        }
    }

    private _markUnCovLines(lines: cov.ILine, activeTextEditor: vscode.TextEditor) {
        this._unCovLineStyle = vscode.window.createTextEditorDecorationType({
            overviewRulerLane: vscode.OverviewRulerLane.Center,
            overviewRulerColor: "#ffffff",
            backgroundColor: "rgba(255,255,255,0.3)"
        });

        const ranges: vscode.Range[] = [];
        for (const line in lines) {
            if (lines[line] == 0) {
                ranges.push(activeTextEditor.document.lineAt(parseInt(line) - 1).range);
            }
        }

        if (ranges.length > 0) {
            activeTextEditor.setDecorations(this._unCovLineStyle, ranges);
        }
    }

    public _markFunc(f: cov.IFunction, fnMap: cov.IFunctionMap, activeTextEditor: vscode.TextEditor) {
        this._unCovFuncStyle = vscode.window.createTextEditorDecorationType({
            overviewRulerLane: vscode.OverviewRulerLane.Full,
            overviewRulerColor: "red",
            backgroundColor: "rgba(200,0,0,0.2)",
            gutterIconPath: path.join(__dirname, '../../../img/red.png')
        });

        this._covFuncStyle = vscode.window.createTextEditorDecorationType({
            overviewRulerLane: vscode.OverviewRulerLane.Full,
            overviewRulerColor: "green",
            backgroundColor: "rgba(0,200,0,0.2)",
            gutterIconPath: path.join(__dirname, '../../../img/green.png')
        });

        const unCovRanges: vscode.Range[] = [];
        const covRanges: vscode.Range[] = [];

        for (const funcNo in f) {
            const line: number = fnMap[funcNo].line - 1;
            const range: vscode.Range = activeTextEditor.document.lineAt(line).range;
            if (f[funcNo] == 0) {
                unCovRanges.push(range);
            } else {
                covRanges.push(range);
            }
        }

        if (unCovRanges.length > 0) {
            activeTextEditor.setDecorations(this._unCovFuncStyle, unCovRanges);
        }

        if (covRanges.length > 0) {
            activeTextEditor.setDecorations(this._covFuncStyle, covRanges);
        }
    }
}