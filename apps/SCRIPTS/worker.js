// worker.js
const fs = require('fs');
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();

async function transcribeAudio(fileName) {
    const file = fs.readFileSync(fileName);
    const audioBytes = file.toString('base64');

    const audio = {
        content: audioBytes,
    };
    const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100,
        languageCode: 'en-US',
    };
    const request = {
        audio: audio,
        config: config,
    };

    try {
        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        return { fileName, transcription };
    } catch (error) {
        throw { fileName, error };
    }
}

module.exports = { transcribeAudio };
