# Project Name

This is a Node.js application which moves files into folders based on the first letter of their filenames. The application supports multiple languages for user interaction.

Requirements:

- Node.js
- npm

Installation:

1. Clone the repository using the command: git clone [repository_link]
2. Move into the project directory with: cd [project_directory]
3. Install the required npm packages with: npm install

TypeScript Compilation:

This project uses the 'inquirer-search-list' module which does not have TypeScript definitions available. To resolve this, you'll need to add a custom type definition:

1. Navigate to the 'inquirer-search-list' module directory inside 'node_modules' using: cd node_modules/inquirer-search-list/dist
2. Create a 'index.d.ts' file using: touch index.d.ts
3. Open the 'index.d.ts' file in any text editor and add the following line: declare module 'inquirer-search-list';
4. Save and close the file.
5. Move back to the root project directory using: cd [project_root_directory]

Now you should be able to compile your TypeScript code without any errors related to the 'inquirer-search-list' module.

Running the Application:

After successfully compiling the TypeScript code, you can run the application using the following command: node dist/index.js
Then, simply follow the on-screen prompts to interact with the application.
