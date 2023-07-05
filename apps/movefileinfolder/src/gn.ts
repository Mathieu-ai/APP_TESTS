import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

interface Answers {
    folderPath: string;
}

inquirer
    .prompt<Answers>( [
        {
            type: 'input',
            name: 'folderPath',
            message: 'Enter the root folder path:',
        },
    ] )
    .then( ( answers: Answers ) => {
        const rootFolderPath=answers.folderPath;
        const resultFolderPath=path.join( rootFolderPath,'result' );

        // Create the 'result' folder in the root folder if it doesn't exist
        if( !fs.existsSync( resultFolderPath ) ) {
            fs.mkdirSync( resultFolderPath );
        }

        // Read the files in the specified folder
        fs.readdir( rootFolderPath,( err,files ) => {
            if( err ) {
                console.error( 'Error reading folder:',err );
                return;
            }

            const filePath=path.join( resultFolderPath,'fileNames.txt' );

            // Create a text file and write the file names into it
            fs.writeFile( filePath,files.join( '\n' ),err => {
                if( err ) {
                    console.error( 'Error writing file:',err );
                    return;
                }
                console.log( 'File names saved to fileNames.txt in the "result" folder.' );
            } );
        } );
    } )
    .catch( ( error: Error ) => {
        console.error( 'Error:',error );
    } );
