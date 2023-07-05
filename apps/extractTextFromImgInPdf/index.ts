import * as fs from 'fs';
import * as path from 'path';
import * as inquirer from 'inquirer';
import * as pdfParse from 'pdf-parse';
import * as pdf2pic from 'pdf2pic';
import { ImageAnnotatorClient } from '@google-cloud/vision';

const client = new ImageAnnotatorClient();

async function extractTextFromImages ( imagesPath: string ): Promise<string> {
    const imageText: string[] = [];
    const files = fs.readdirSync( imagesPath );
    for ( const file of files ) {
        const [ result ] = await client.textDetection( path.join( imagesPath, file ) );
        const detections = result.textAnnotations;
        imageText.push( 'Text from image:\n' + detections[ 0 ].description + '\n\n' );
    }
    return imageText.join( '' );
}

async function deleteImages ( imagesPath: string ): Promise<void> {
    const files = fs.readdirSync( imagesPath );
    for ( const file of files ) {
        fs.unlinkSync( path.join( imagesPath, file ) );
    }
}

try {
    inquirer
        .prompt( [
            {
                type: 'input',
                name: 'filePath',
                message: 'Please enter path to PDF:',
            },
            {
                type: 'input',
                name: 'fileName',
                message: 'What should the output file be named?',
            },
        ] )
        .then( async ( answers ) => {
            const normalizedPath = path.normalize( answers.filePath );
            const dataBuffer = fs.readFileSync( normalizedPath );
            const data = await pdfParse( dataBuffer );

            const textOutput: string[] = [];
            for ( let i = 0; i < data.numpages; i++ ) {
                textOutput.push( 'Page ' + ( i + 1 ) + ':\n' + data.text + '\n\n' );
            }

            const imagesPath = path.join( __dirname, 'images' );
            if ( !fs.existsSync( imagesPath ) ) {
                fs.mkdirSync( imagesPath );
            }

            const options = {
                density: 100,
                saveFilename: 'temp',
                savePath: imagesPath,
                format: 'png',
                width: 600,
                height: 600,
            };

            const storeAsImage = pdf2pic.fromPath( normalizedPath, options );

            for ( let i = 1; i <= data.numpages; i++ ) {
                await storeAsImage( i );
            }

            const imageText = await extractTextFromImages( imagesPath );
            textOutput.push( imageText );

            fs.writeFileSync( `${ answers.fileName }.txt`, textOutput.join( '' ) );

            // Deleting images after text extraction
            await deleteImages( imagesPath );
        } );
} catch ( error ) {
    console.error( 'Caught an error:', error );
}
