const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');

async function copyFilesFromTxt() {
    try {
        // Ask the user for the path to the .txt file
        let txtFilePath = readlineSync.question('Please enter the path to the .txt file: ');

        // Normalize the path (converts all slashes to the appropriate type for the current platform)
        txtFilePath = path.normalize(txtFilePath);

        // Ask the user for the path to the output directory
        let outputDir = readlineSync.question('Please enter the path to the output directory: ');

        // Normalize the path
        outputDir = path.normalize(outputDir);

        // Ensure output directory path does not end with a slash
        if (outputDir.endsWith(path.sep)) {
            outputDir = outputDir.slice(0, -1);
        }

        // Read the .txt file
        const data = fs.readFileSync(txtFilePath, 'utf8');

        // Split the file contents into lines
        const lines = data.split('\n');

        // For each line, copy the file to the output directory
        for (let line of lines) {
            // Trim any leading or trailing white space
            line = line.trim();

            // If the line is empty, skip it
            if (line === '') continue;

            // Normalize the path
            line = path.normalize(line);

            // Check if the source file exists
            if (!fs.existsSync(line)) {
                console.error(`Source file does not exist: ${line}`);
                continue;
            }

            // Get the base name of the file
            const baseName = path.basename(line);

            // Construct the path to the new file in the output directory
            const newFilePath = path.join(outputDir, baseName);

            // Copy the file
            try {
                fs.copyFileSync(line, newFilePath);
                console.log(`Copied file to ${newFilePath}`);
            } catch (error) {
                console.error(`Failed to copy file ${line} to ${newFilePath}: ${error.message}`);
            }
        }
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
    }
}

copyFilesFromTxt();
