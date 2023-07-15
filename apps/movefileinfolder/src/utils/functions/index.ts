import { access as acc,stat as stats,constants,readdirSync,renameSync,rmdirSync,existsSync,mkdirSync,statSync } from 'fs';
import { promisify } from 'util';
import { Sims4Authors,affirmations,gameChoices,nonCharOptions,questions,} from "../props";
import { readdir,mkdir,rename,opendir,writeFile } from 'fs/promises';
import { join,basename,normalize,extname } from 'path';
import colors from 'colors';
import inquirer from 'inquirer';
import InquirerSearchList from 'inquirer-search-list';
import { Answers,AnswersGn,MoveFilesOptions,RegexMap,UserInput } from '../types';
inquirer.registerPrompt( 'search-list',InquirerSearchList );

export const access=promisify( acc );
export const stat=promisify( stats );

export function isAffirmative( response: string,language: string ): boolean {
    return response===affirmations[ language ][ 0 ];
}

export function useFirstLetter( option: string,language: string ): boolean {
    return option===nonCharOptions[ language ][ 0 ];
}


export function getSimsAuthorsName( fileName: string ): string {
    const normalizedFileName=fileName.toLowerCase().replace( /package|ts4script/g,'' );

    // regex : brackets, braces, and parentheses
    let bracketRegex=/\[(.*?)\]|\{(.*?)\}|\((.*?)\)/g;

    // Extract words with regex
    let bracketMatches=Array.from( normalizedFileName.matchAll( bracketRegex ) )
        .map( match => match[ 1 ]||match[ 2 ]||match[ 3 ] );

    let lowerCasedSims4Authors=Sims4Authors
        .map( author => author.toLowerCase() )
        .sort( ( a,b ) => b.length-a.length );

    let findMatch=( wordSet: string[],wholeWord=true ) => {
        let flag=wholeWord? "\\b":"";
        for( let specialCase of lowerCasedSims4Authors ) {
            let specialCaseReg=new RegExp( `${ flag }${ specialCase }${ flag }`,"g" );
            for( let word of wordSet ) {
                if( specialCaseReg.test( word ) ) {
                    return specialCase;
                }
            }
        }
        return '';
    }

    // find matches
    let match=findMatch( bracketMatches )
        ||findMatch( [ normalizedFileName ] )
        ||findMatch( [ normalizedFileName ],false );

    return match? match.toUpperCase():'0';
}

// Method for validating directory existence
export const validateDirectory=async ( input: string ) => {
    try {
        await access( input,constants.F_OK );
        const stats=await stat( input );
        if( !stats.isDirectory() ) {
            throw new Error( "Not a directory" );
        }
        return true;
    } catch( error ) {
        return `${ input } is not a valid directory. Please enter a valid directory path.`;
    }
};

export async function moveFiles(
    dirPath: string,
    checkNested: boolean,
    nonCharOption: boolean,
    gameName: string,
    language: string
): Promise<void> {
    try {
        const files=await readdir( dirPath,{ withFileTypes: true } );
        for( const file of files ) {
            const filePath: string=join( dirPath,file.name );
            const stats=await stat( filePath );

            if( stats.isDirectory() ) {
                if( checkNested ) {
                    await moveFiles( filePath,checkNested,nonCharOption,gameName,language );
                }
            } else {
                let folderName: string='0'; // default to '0'

                // Only call getAuthorName for SIMS 4 game
                if( gameName==='SIMS 4' ) {
                    folderName=getSimsAuthorsName( file.name );
                }

                if( folderName!==basename( dirPath )||gameName!=='' ) {
                    const targetDir: string=join( dirPath,folderName );
                    await mkdir( targetDir,{ recursive: true } ).catch( ( err ) => {
                        if( err.code!=='EEXIST' ) {
                            throw err;
                        }
                    } );

                    const targetPath: string=join( targetDir,file.name );
                    await rename( filePath,targetPath );
                    console.log( `Moved ${ file.name } to ${ targetDir }`.bgGreen+"\n" );
                }
            }
        }
    } catch( err: any ) {
        console.error( `Error: ${ err.message }` );
    }
}

export async function ExecutemoveFiles( asyncFunc: () => Promise<void>,errorHandler: ( err: any ) => void ) {
    try {
        await asyncFunc();
    } catch( err ) {
        errorHandler( err );
    }
}

export async function promptUser() {

    const { language }=await inquirer.prompt( [
        {
            type: 'search-list',
            name: 'language',
            message: 'Please choose your language:',
            choices: Object.keys( questions ),
        },
    ] );

    const { folderPath }=await inquirer.prompt( [
        {
            type: 'input',
            name: 'folderPath',
            message: questions[ language ].path,
            validate: validateDirectory, // Added directory validation
        },
    ] );

    const { gameOption }=await inquirer.prompt( [
        {
            type: 'search-list',
            name: 'gameOption',
            message: 'Do you want to organize game files?',
            choices: affirmations[ language ],
        },
    ] );

    let nonCharOption=false;
    let gameName='';

    if( isAffirmative( gameOption,language ) ) {
        const { gameNameOption }=await inquirer.prompt( [
            {
                type: 'search-list',
                name: 'gameNameOption',
                message: 'Which game do you want to sort?',
                choices: gameChoices[ language ],
            },
        ] );
        gameName=gameNameOption;
    } else {
        const { nonChar }=await inquirer.prompt( [
            {
                type: 'search-list',
                name: 'nonChar',
                message: questions[ language ].nonChar,
                choices: questions[ language ].nonCharOptions,
            },
        ] );
        nonCharOption=useFirstLetter( nonChar,language );
    }

    const { nested }=await inquirer.prompt( [
        {
            type: 'search-list',
            name: 'nested',
            message: questions[ language ].nested,
            choices: questions[ language ].options,
        },
    ] );

    const checkNested: boolean=isAffirmative( nested,language );

    // Updated function call with gameName
    await moveFiles( folderPath,checkNested,nonCharOption,gameName,language );
}

export function errorHandler( err: any ) {
    const errorMessages=[ err.message ];
    console.error( colors.bgRed.black( errorMessages.join( "\n" ) ) );
}

export const DEFAULT_LOG_FUNCTION=( message: string ) => console.log( message );
export const DEFAULT_ERROR_FUNCTION=( error: Error ) => console.error( 'Error:',error );

export function moveFilesRecursively( folderPath: string,rootFolder: string,options: MoveFilesOptions ): void {
    const { logFunction=DEFAULT_LOG_FUNCTION,errorFunction=DEFAULT_ERROR_FUNCTION }=options;
    const files=readdirSync( folderPath );

    for( const file of files ) {
        const filePath=join( folderPath,file );
        const targetFilePath=join( rootFolder,file );

        if( statSync( filePath ).isDirectory() ) {
            moveFilesRecursively( filePath,rootFolder,options ); // recurse into subdirectory
        } else {
            try {
                renameSync( filePath,targetFilePath );
                logFunction( `Moved ${ file } to ${ rootFolder }` );
            } catch( e: any ) {
                errorFunction( e );
            }
        }
    }

    if( folderPath!==rootFolder ) { // prevent deletion of the root folder
        try {
            rmdirSync( folderPath );
            logFunction( `Removed folder ${ folderPath }` );
        } catch( e: any ) {
            errorFunction( e );
        }
    }
}

export function moveFilesToRootFolder( rootFolder: string,options: MoveFilesOptions ): void {
    const { logFunction=DEFAULT_LOG_FUNCTION,errorFunction=DEFAULT_ERROR_FUNCTION }=options;
    const files=readdirSync( rootFolder,{ withFileTypes: true } );

    for( const file of files ) {
        const filePath=join( rootFolder,file.name );

        if( file.isDirectory() ) {
            const subFolderFiles=readdirSync( filePath );

            for( const subFile of subFolderFiles ) {
                const subFilePath=join( filePath,subFile );
                const targetFilePath=join( rootFolder,subFile );

                try {
                    renameSync( subFilePath,targetFilePath );
                    logFunction( `Moved ${ subFile } to ${ rootFolder }` );
                } catch( e: any ) {
                    errorFunction( e );
                }
            }

            try {
                rmdirSync( filePath );
                logFunction( `Removed subfolder ${ filePath }` );
            } catch( e: any ) {
                errorFunction( e );
            }
        }
    }
}

export function promptUserAndMoveFiles( options: MoveFilesOptions ): void {
    inquirer
        .prompt( [
            {
                type: 'input',
                name: 'rootFolder',
                message: 'Enter the root folder path:',
            },
            {
                type: 'confirm',
                name: 'flatten',
                message: 'Do you want to flatten nested folders?',
                default: false,
            },
        ] )
        .then( ( answers ) => {
            const rootFolder=normalize( answers.rootFolder );
            if( answers.flatten ) {
                moveFilesRecursively( rootFolder,rootFolder,options );
            } else {
                moveFilesToRootFolder( rootFolder,options );
            }
        } )
        .catch( ( error: Error ) => {
            options.errorFunction&&options.errorFunction( error );
        } );
}

export async function getUserInput(): Promise<UserInput> {
    const questions=[
        {
            name: 'directoryPath',
            type: 'input',
            message: 'Enter a directory path:',
            validate: function( value: string ) {
                const normalizedPath=normalize( value );
                if( normalizedPath.length ) {
                    if( !existsSync( normalizedPath ) ) {
                        return 'Path does not exist. Please enter a valid path.';
                    }
                    return true;
                } else {
                    return 'Please enter a path.';
                }
            },
        },
        {
            name: 'outputFilename',
            type: 'input',
            message: 'Enter the output filename:',
            validate: function( value: string ) {
                if( value.length ) {
                    return true;
                } else {
                    return 'Please enter a filename.';
                }
            },
        },
        {
            name: 'outputFormat',
            type: 'list',
            message: 'Choose the output format:',
            choices: [ 'js','json','txt' ],
        },
        {
            name: 'outputPath',
            type: 'input',
            message: 'Enter the path to save the file:',
            validate: function( value: string ) {
                const normalizedPath=normalize( value );
                if( normalizedPath.length ) {
                    return true;
                } else {
                    return 'Please enter a path.';
                }
            },
        },
        {
            name: 'pattern',
            type: 'list',
            message: 'Choose the pattern to match:',
            choices: [ 'brackets','braces','parentheses' ],
        },
    ];

    const answers=await inquirer.prompt<UserInput>( questions );
    answers.directoryPath=normalize( answers.directoryPath );
    answers.outputPath=normalize( answers.outputPath );
    return answers;
}

export async function processFiles( userInput: UserInput ) {
    try {
        const dir=await opendir( userInput.directoryPath );
        const results: Record<string,string>={};

        const regexes: RegexMap={
            brackets: /(?<=\[).+?(?=\])/g,
            braces: /(?<={).+?(?=})/g,
            parentheses: /(?<=\().+?(?=\))/g,
        };

        const regex=regexes[ userInput.pattern ];

        for await( const dirent of dir ) {
            const baseName=basename( dirent.name,extname( dirent.name ) );
            const matches=baseName.match( regex );

            if( matches ) {
                const uniqueMatches=Array.from( new Set( matches ) );

                for( const match of uniqueMatches ) {
                    results[ match ]=match;
                }
            }
        }

        const { outputFilename,outputFormat,outputPath }=userInput;
        let formattedResults;

        switch( outputFormat ) {
            case 'js':
                formattedResults=`module.exports = ${ JSON.stringify( results,null,2 ) }`;
                break;
            case 'json':
                formattedResults=JSON.stringify( results,null,2 );
                break;
            case 'txt':
                formattedResults=JSON.stringify( results );
                break;
            default:
                throw new Error( `Unsupported format: ${ outputFormat }` );
        }

        if( !existsSync( outputPath ) ) {
            mkdirSync( outputPath,{ recursive: true } );
        }

        await writeFile( join( outputPath,`${ outputFilename }.${ outputFormat }` ),formattedResults );
        console.log( `File writing completed. Check "${ outputFilename }.${ outputFormat }" in the directory: "${ outputPath }".` );

    } catch( err ) {
        console.error( `An error occurred: ${ err }` );
    }
}

export async function getBBP() {
    const userInput=await getUserInput();
    await processFiles( userInput );
}

export async function runGn() {
    try {
        const answers: AnswersGn=await inquirer.prompt<AnswersGn>( [
            {
                type: 'input',
                name: 'folderPath',
                message: 'Enter the root folder path:',
            },
        ] );

        const { folderPath }=answers;
        const resultFolderPath=join( folderPath,'result' );

        // Create the 'result' folder in the root folder if it doesn't exist
        try {
            await access( resultFolderPath );
        } catch {
            await mkdir( resultFolderPath );
        }

        // Read the files in the specified folder
        const files=await readdir( folderPath );

        const resultFilePath=join( resultFolderPath,'fileNames.txt' );

        // Create a text file and write the file names into it
        await writeFile( resultFilePath,files.join( '\n' ) );

        console.log( 'File names saved to fileNames.txt in the "result" folder.' );

    } catch( error: any ) {
        console.error( 'Error:',error );
    }
}