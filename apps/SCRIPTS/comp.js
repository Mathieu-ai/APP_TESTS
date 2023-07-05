const readline = require('readline');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

async function main() {
    try {
        const firstFilePath = await askFilePath('Enter the path of the first .txt file: ');
        const secondFilePath = await askFilePath('Enter the path of the second .txt file: ');

        const action = await askAction();

        const firstFileLines = new Set(await readLines(firstFilePath));
        const secondFileLines = new Set(await readLines(secondFilePath));

        let sourceLines;
        let targetFilePath;

        switch (action) {
            case 1:
                sourceLines = getUniqueLines(firstFileLines, secondFileLines);
                targetFilePath = secondFilePath;
                break;
            case 2:
                let outputFolder = await askFolder('Enter the path of the output folder: ');
                if (!fs.existsSync(outputFolder)) {
                    fs.mkdirSync(outputFolder, { recursive: true });
                    console.log(`Output folder ${outputFolder} was created because it didn't exist.`);
                }

                let outputFileName = await askFileName('Enter the name of the output .txt file (without .txt extension): ');
                let outputPath = path.join(outputFolder, outputFileName + '.txt');

                if (fs.existsSync(outputPath)) {
                    const { action } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'action',
                            message: 'Output file already exists. Choose an action:',
                            choices: [
                                '1. Overwrite the file',
                                '2. Enter a new file name',
                                '3. Auto increment the file name'
                            ],
                            filter: function (val) {
                                return parseInt(val.split('.')[0]);
                            }
                        }
                    ]);

                    switch (action) {
                        case 1:
                            break;
                        case 2:
                            outputFileName = await askFileName('Enter a new name for the output .txt file (without .txt extension): ');
                            outputPath = path.join(outputFolder, outputFileName + '.txt');
                            break;
                        case 3:
                            let i = 1;
                            while (fs.existsSync(path.join(outputFolder, outputFileName + '_' + i + '.txt'))) {
                                i++;
                            }
                            outputFileName += '_' + i;
                            outputPath = path.join(outputFolder, outputFileName + '.txt');
                            break;
                        default:
                            throw new Error("Unexpected action");
                    }
                }
                sourceLines = [...firstFileLines, ...secondFileLines];
                targetFilePath = outputPath;
                break;
            case 3:
                sourceLines = getUniqueLines(secondFileLines, firstFileLines);
                targetFilePath = firstFilePath;
                break;
            default:
                throw new Error("Unexpected action");
        }

        await writeLines(targetFilePath, sourceLines);
    } catch (error) {
        console.error(error);
    }
}

async function askFolder(question) {
    const { path } = await inquirer.prompt([{
        type: 'input',
        name: 'path',
        message: question
    }]);
    return path;
}

async function askFilePath(question) {
    let filePath;
    do {
        filePath = await inquirer.prompt([{
            type: 'input',
            name: 'path',
            message: question,
            validate: async (input) => {
                if (fs.existsSync(input)) {
                    return true;
                } else {
                    return `${input} does not exist`;
                }
            }
        }]);
    } while (!fs.existsSync(filePath.path));
    return filePath.path;
}

async function askFileName(question) {
    let fileName;
    do {
        fileName = await inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: question,
            validate: async (input) => {
                if (!input.endsWith('.txt')) {
                    return true;
                } else {
                    return `File name should not end with .txt`;
                }
            }
        }]);
    } while (fileName.name.endsWith('.txt'));
    return fileName.name;
}

async function askAction() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose an action:',
            choices: [
                '1. Copy non-duplicate lines from first file to second file',
                '2. Create a new .txt file with non-duplicate lines',
                '3. Copy non-duplicate lines from second file to first file'
            ],
            filter: function (val) {
                return parseInt(val.split('.')[0]);
            }
        }
    ]);
    return action;
}

function getUniqueLines(set1, set2) {
    return [...set1].filter(line => !set2.has(line));
}

async function readLines(filePath) {
    const lines = [];
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        lines.push(line);
    }
    return lines;
}

async function writeLines(filePath, lines) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        lines.forEach((line, index) => {
            // Trim the line to remove any extra whitespace
            const trimmedLine = line.trim();
            // Write the line to the file
            fileStream.write(`${trimmedLine}\n`);
            // Check if the next line is a path (contains "\") or if this is the last line
            if (index === lines.length - 1 || (lines[index + 1].trim().includes('\\'))) {
                // If it is, write an extra newline to the file
                fileStream.write('\n');
            }
        });
        fileStream.end(() => {
            console.log(`Finished writing to ${filePath}`);
            resolve();
        });
        fileStream.on('error', reject);
    });
}

main();
