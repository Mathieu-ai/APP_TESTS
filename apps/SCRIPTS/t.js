const fs = require('fs');
const readlineSync = require('readline-sync');
const path = require('path');

function main() {
    // Ask for the file
    const file = readlineSync.question('Please enter the path to the .txt file: ');

    // Read the file
    let lines = fs.readFileSync(file, 'utf-8').split('\n').filter(Boolean);

    let modifiedLines = [];
    for (let line of lines) {
        let baseName = path.basename(line);
        // Remove the last period and replace underscores with spaces
        let modifiedName = baseName.slice(0, baseName.lastIndexOf('.')).replace(/_/g, ' ');  
        // Keep original line
        modifiedLines.push(line);  
        // Add modified name
        modifiedLines.push(modifiedName);  
        // Add empty line for spacing
        modifiedLines.push('');  
    }
    // Write the modified lines back to the file
    fs.writeFileSync(file, modifiedLines.join('\n'), 'utf-8');
    console.log('File modified successfully.');
}

main()