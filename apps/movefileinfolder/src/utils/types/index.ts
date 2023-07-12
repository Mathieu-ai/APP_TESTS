export interface LanguageOptions {
    [ key: string ]: string[];
}

export interface QuestionObject {
    [ key: string ]: {
        path: string;
        nested: string;
        nonChar: string;
        options: string[];
        nonCharOptions: string[];
        language: string;
    };
}

export interface Answers {
    rootFolder: string;
    deleteFolders: boolean;
}

export interface AnswersGn {
    folderPath: string;
}

export interface MoveFilesOptions {
    logFunction?: ( message: string ) => void;
    errorFunction?: ( error: Error ) => void;
}

export type Pattern='brackets'|'braces'|'parentheses';
export type RegexMap=Record<Pattern,RegExp>;

export interface UserInput {
    directoryPath: string;
    outputFilename: string;
    outputFormat: string;
    outputPath: string;
    pattern: Pattern;
}