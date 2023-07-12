# MoveFiles

This is a Node.js application that moves files into folders based on the first letter of their filenames. The application supports multiple languages for user interaction.

## Requirements

- [Node.js](https://nodejs.org/en)
- module manager

## Installation

1. Clone the repository using the command: `git clone https://github.com/Mathieu-ai/APP_TESTS`
2. Move into the project directory with: `cd APP_TESTS`
3. Install the required npm packages with: `npm install`

## TypeScript Compilation

This project uses the 'inquirer-search-list' module, which does not have TypeScript definitions available. To resolve this, you'll need to add a custom type definition:

1. Navigate to the 'inquirer-search-list' module directory inside 'node_modules' using: `cd node_modules/inquirer-search-list/dist`
2. Create an 'index.d.ts' file using: `touch index.d.ts`
3. Open the 'index.d.ts' file in any text editor and add the following line: `declare module 'inquirer-search-list';`
4. Save and close the file.
5. Move back to the root project directory using: `cd ../../../`

Now you should be able to compile your TypeScript code without any errors related to the 'inquirer-search-list' module.

## Running the Application

After successfully compiling the TypeScript code, you can run the application using the following command:

```bash
  node move
  # or 
  yarn run move
  # or 
  pnpm run move
```

```bash
  node flat
  # or 
  yarn run flat
  # or 
  pnpm run flat
```

```bash
  node gBBP
  # or 
  yarn run gBBP
  # or 
  pnpm run gBBP
```

```bash
  node gN
  # or 
  yarn run gN
  # or 
  pnpm run gN
```

Then, simply follow the on-screen prompts to interact with the application.
