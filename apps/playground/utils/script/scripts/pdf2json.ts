
import fs from 'fs'
import pdf from 'pdf-parse';

export function pdf2json(file: string) {
    let dataBuffer=fs.readFileSync(file);
    pdf(dataBuffer).then(function(data) {
        // number of pages
        //return data.numpages;
        // number of rendered pages
        //return data.numrender;
        // PDF info
        //return data.info;
        // PDF metadata
        return data.metadata;
        // PDF.js version
        // check https://mozilla.github.io/pdf.js/getting_started/
        //return data.version;
        // PDF text
        //return data.text;
    });
}
