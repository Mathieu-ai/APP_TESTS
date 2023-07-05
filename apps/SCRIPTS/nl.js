const fs = require('fs-extra');
const inquirer = require('inquirer');
const path = require('path');

const ACTIONS = {
    CREATE: 1,
    OVERWRITE: 2
};

async function askFilePath(message) {
    return await inquirer.prompt([{
        name: 'filePath',
        message: message,
        validate: async (input) => {
            const normalizedPath = path.normalize(input);
            if (!fs.existsSync(normalizedPath)) {
                return `Path does not exist: ${normalizedPath}`;
            }
            return true;
        }
    }]);
}

async function askAction() {
    return await inquirer.prompt([{
        name: 'action',
        type: 'list',
        message: 'What action should be taken?',
        choices: [
            { name: 'Create new file', value: ACTIONS.CREATE },
            { name: 'Overwrite existing file', value: ACTIONS.OVERWRITE }
        ]
    }]);
}

async function askFileName(outputDir) {
    return await inquirer.prompt([{
        name: 'filename',
        message: 'New file name:',
        validate: async (input) => {
            const filePath = path.join(outputDir, input);
            if (fs.existsSync(filePath)) {
                return 'File already exists. Choose another name.';
            }
            return true;
        }
    }]);
}

async function processFile(inputFile, outputFilePath) {
    const fileContent = await fs.readFile(inputFile, 'utf-8');
    const lines = fileContent.split(/\r?\n/);

    let outputContent = '';
    for (const line of lines) {
        if (path.extname(line) === '.wav') {
            let fileName = path.basename(line, '.wav');
            fileName = fileName.replace(/_/g, ' ');
            outputContent += `${line}.wav\n${fileName}\n`;
        } else {
            outputContent += `${line}\n`;
        }
    }

    await fs.writeFile(outputFilePath, outputContent);

    console.log(`File written to: ${outputFilePath}`);
}

async function main() {
    const { filePath: inputFile } = await askFilePath('Path of the .txt file:');
    const { filePath: outputDir } = await askFilePath('Path of the output directory:');
    const { action } = await askAction();

    let outputFilePath;

    if (action === ACTIONS.CREATE) {
        const { filename } = await askFileName(outputDir);
        outputFilePath = path.join(outputDir, filename);
    } else {
        outputFilePath = inputFile;
    }

    await processFile(inputFile, outputFilePath);
}

main().catch(console.error);
