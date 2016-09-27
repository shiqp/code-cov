/**
 * file name and the coverage info for this file
 */
export interface ICoverageInfo {
  [fileName: string]: IFileCoverageDetail;
}

/**
 * coverage info for one file
 */
export interface IFileCoverageDetail {
  path: string;
  s: IStatement;
  b: IBranch;
  f: IFunction;
  fnMap: IFunctionMap;
  statementMap: IStatementMap;
  branchMap: IBranchMap;
  code: string[];
  l: ILine;
}

/**
 * statement coverage info for one file
 * statement number and how many times the statement is hit
 */
export interface IStatement {
  [statementNo: string]: number;
}

/**
 * branch coverage info for one file
 * branch number and the hit info of the branch
 */
export interface IBranch {
  [branchNo: string]: number[];
}

/**
 * function coverage info for one file
 * function number and how many times the function is hit
 */
export interface IFunction {
  [functionNo: string]: number;
}

/**
 * function number and the detail of this function
 */
export interface IFunctionMap {
  [functionNo: string]: IFunctionMapDetail;
}

/**
 * detail of one function
 */
export interface IFunctionMapDetail {
  name: string;
  line: number;
  loc: ILoc;
  skip?: boolean;
}

/**
 * statement number and the detail of this statement
 */
export interface IStatementMap {
  [statementNo: string]: ILoc;
}

/**
 * branch number and the detail of this branch
 */
export interface IBranchMap {
  [branchNo: string]: IBranchMapDetail;
}

/**
 * detail of one branch
 */
export interface IBranchMapDetail {
  line: number;
  type: string;
  locations: ILoc[];
}

/**
 * line coverage info for one file
 * line number and how many times the line is hit
 */
export interface ILine {
  [lineNo: string]: number;
}

/**
 * the location
 */
export interface ILoc {
  start: IPosition;
  end: IPosition;
  skip?: boolean;
}

/**
 * in which line and in which column
 */
export interface IPosition {
  line: number;
  column: number;
}