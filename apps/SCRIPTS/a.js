const fs = require( 'fs' );
const inquirer = require( 'inquirer' );
const tf = require( '@tensorflow/tfjs-node' );
const { loadTokenizer, loadModel } = require( '@tensorflow-models/universal-sentence-encoder' );

let tokenizer;
let model;

async function initializeModel () {
    tokenizer = await loadTokenizer();
    model = await loadModel();
}

async function processText ( inputText ) {
    const sentences = inputText.split( '\n' );
    const processedSentences = [];

    for ( const sentence of sentences ) {
        const encodedSentence = await encodeSentence( sentence );
        const sentenceType = classifySentence( encodedSentence );
        const processedSentence = addPunctuation( sentence, sentenceType );
        processedSentences.push( processedSentence );
    }

    return processedSentences.join( '\n' );
}

async function encodeSentence ( sentence ) {
    const tokenizedSentence = tokenizer.encode( sentence );
    const sentenceTensor = tf.tensor2d( [ tokenizedSentence ], [ 1, tokenizedSentence.length ] );
    const encodedSentence = await model.embed( sentenceTensor );
    return encodedSentence;
}

function classifySentence ( encodedSentence ) {
    const predictions = Array.from( encodedSentence.dataSync() );
    const maxProbability = Math.max( ...predictions );
    const sentenceType = encodedSentence.argMax().dataSync()[ 0 ];

    // determine sentence types
    if ( maxProbability > 0.5 ) {
        if ( sentenceType === 0 ) {
            return 'question';
        } else if ( sentenceType === 1 ) {
            return 'affirmation';
        } else if ( sentenceType === 2 ) {
            return 'insult';
        } else if ( sentenceType === 3 ) {
            return 'exclamation';
        }
    }

    return 'unknown';
}

function addPunctuation ( sentence, sentenceType ) {
    const punctuationMap = {
        question: '?',
        affirmation: '.',
        insult: '!',
        exclamation: '!'
    };

    const punctuation = punctuationMap[ sentenceType ] || '.';

    return `${ sentence.trim() }${ punctuation }`;
}

// Prompt user for the input file
inquirer.prompt( [
    {
        type: 'input',
        name: 'inputFile',
        message: 'Enter the name of the input file (including the extension):',
    }
] ).then( async answers => {
    const inputFile = answers.inputFile;
    const outputFile = 'new.txt';

    // Read the input file
    fs.readFile( inputFile, 'utf8', async ( err, data ) => {
        if ( err ) {
            console.error( err );
            return;
        }

        // Initialize the NLP model
        await initializeModel();

        // Process the text
        const processedText = await processText( data );

        // Write the modified text to the output file
        fs.writeFile( outputFile, processedText, 'utf8', ( err ) => {
            if ( err ) {
                console.error( err );
                return;
            }
            console.log( `Modified text saved to ${ outputFile }.` );
        } );
    } );
} );
