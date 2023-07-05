import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

function moveFilesToRootFolder ( rootFolder: string ): void {
    const files=fs.readdirSync( rootFolder,{ withFileTypes: true } );

    for( const file of files ) {
        const filePath=path.join( rootFolder,file.name );

        if( file.isDirectory() ) {
            const subFolderFiles=fs.readdirSync( filePath );

            for( const subFile of subFolderFiles ) {
                const subFilePath=path.join( filePath,subFile );
                const targetFilePath=path.join( rootFolder,subFile );

                fs.renameSync( subFilePath,targetFilePath );
                console.log( `Moved ${ subFile } to ${ rootFolder }` );
            }

            fs.rmdirSync( filePath );
            console.log( `Removed subfolder ${ filePath }` );
        }
    }
}

interface Answers {
    rootFolder: string;
    deleteFolders: boolean;
}

// Use inquirer to prompt the user for the root folder path and whether to delete emptied folders
inquirer
    .prompt<Answers>( [
        {
            type: 'input',
            name: 'rootFolder',
            message: 'Enter the root folder path:',
        },
        {
            type: 'confirm',
            name: 'deleteFolders',
            message: 'Do you want to delete emptied folders after moving the files?',
            default: false,
        },
    ] )
    .then( ( answers: Answers ) => {
        // Normalize the path to handle slashes and backslashes
        const rootFolder=path.normalize( answers.rootFolder );

        // Move files to the root folder
        moveFilesToRootFolder( rootFolder );

        // Check if the user wants to delete emptied folders
        if( answers.deleteFolders ) {
            const emptyFolders=fs
                .readdirSync( rootFolder,{ withFileTypes: true } )
                .filter(
                    ( file ) =>
                        file.isDirectory()&&
                        fs.readdirSync( path.join( rootFolder,file.name ) ).length===0
                )
                .map( ( file ) => path.join( rootFolder,file.name ) );

            for( const folder of emptyFolders ) {
                fs.rmdirSync( folder );
                console.log( `Removed empty folder ${ folder }` );
            }
        }
    } )
    .catch( ( error: Error ) => {
        console.error( 'Error:',error );
    } );
