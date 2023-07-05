// Import required packages
const readline = require('readline-sync');
const fs = require('fs');
const path = require('path');
const Piscina = require('piscina');
const colors = require('colors');

// Create a worker pool
const piscina = new Piscina({
    filename: path.resolve(__dirname, 'worker.js'),
    maxThreads: 5,
});

async function transcribeAudioFiles() {
    // Prompt for the folder path
    let folderPath = readline.question('Please enter the folder path: ');

    // Normalize the path (this handles differences in slash direction and trailing slashes)
    folderPath = path.normalize(folderPath);

    // Get a list of all files in the folder
    const allFiles = fs.readdirSync(folderPath);

    // Filter for WAV files
    const files = allFiles.filter(file => path.extname(file).toLowerCase() === '.wav');

    console.log('', `Found ${files.length} WAV files. `.bgCyan.white.bold);

    // Loop through each file
    for (let i = 0; i < files.length; i++) {
        const fileName = path.join(folderPath, files[i]);

        console.log(` scanning ${fileName} `.white.italic);

        // Detects speech in the audio file
        try {
            const result = await piscina.run(fileName);
            // Write the transcription to a text file
            fs.appendFileSync(path.join(folderPath, 'transcriptions.txt'), `${result.fileName}\n${result.transcription}\n\n`);

            console.log(` Wrote transcription for ${result.fileName} `.green.bold);
            console.log(` Files left : ${files.length - i - 1} `.yellow.bold);
        } catch (error) {
            console.error('', `Failed to transcribe ${error.fileName}: ${error} `.bgWhite.red.bold);
        }
    }

    console.log('', 'Transcriptions completed.'.bgGreen.white.bold);
}

transcribeAudioFiles().catch(console.error);
