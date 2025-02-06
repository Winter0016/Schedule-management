const speech = require('@google-cloud/speech');
const fs = require('fs');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

const client = new speech.SpeechClient({
    keyFilename: './private/gen-lang-client-0624281144-f9b849b4cb7a.json' // Change this to your service account JSON file path
});

async function convertToMono(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputFile)
            .setFfmpegPath(ffmpegPath)
            .audioChannels(1) // Set to mono
            .toFormat('wav') // Output format
            .on('end', () => {
                console.log('Conversion to mono completed.');
                resolve();
            })
            .on('error', (err) => {
                console.error('Error during conversion:', err);
                reject(err);
            })
            .save(outputFile);
    });
}

async function transcribeAudio() {
    const inputFileName = './private/harvard.wav'; // Original audio file
    const outputFileName = './private/harvard_mono.wav'; // Converted mono audio file

    // Convert audio to mono
    await convertToMono(inputFileName, outputFileName);

    // Read the converted audio file and convert it to a Buffer
    const file = fs.readFileSync(outputFileName);
    const audioBytes = file.toString('base64');

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        content: audioBytes,
    };

    const config = {
        encoding: 'LINEAR16', // Change this based on your audio file format
        sampleRateHertz: 44100, // Change this based on your audio file sample rate
        languageCode: 'en-US', // Change this to your desired language code
    };

    const request = {
        audio: audio,
        config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    console.log(`Transcription: ${transcription}`);
}

// Call the function to transcribe audio
transcribeAudio().catch(console.error);