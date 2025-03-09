const speech = require('@google-cloud/speech');
const fs = require('fs');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path; // Use ffprobe-static to get the path
const ffmpeg = require('fluent-ffmpeg');

// Set ffmpeg and ffprobe paths
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath); // Set the path for ffprobe

const client = new speech.SpeechClient({
    keyFilename: './private/gen-lang-client-0624281144-f9b849b4cb7a.json' // Change this to your service account JSON file path
});

// Function to get the sample rate of the audio file using ffprobe
async function getSampleRate(inputFile) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(inputFile, (err, metadata) => {
            if (err) {
                return reject(err);
            }
            // console.log('Metadata:', metadata); // Log metadata to see the structure
            const sampleRate = metadata.streams[0].sample_rate; // Get the sample rate from the metadata
            resolve(parseInt(sampleRate, 10)); // Return the sample rate as an integer
        });
    });
}

// Function to convert audio to mono
async function convertToMono(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputFile)
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

// Function to transcribe audio
async function transcribeAudio() {
    const inputFileName = './audio/harvard.wav'; // Original audio file
    const outputFileName = './audio/receive_mono.wav'; // Converted mono audio file

    // Convert audio to mono
    await convertToMono(inputFileName, outputFileName);

    // Get the sample rate of the original audio file
    const sampleRateHertz = await getSampleRate(inputFileName);

    // Read the converted audio file and convert it to a Buffer
    const file = fs.readFileSync(outputFileName);
    const audioBytes = file.toString('base64');

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        content: audioBytes,
    };

    const config = {
        encoding: 'LINEAR16', // Change this based on your audio file format
        sampleRateHertz: sampleRateHertz, // Use the dynamically extracted sample rate
        languageCode: 'en-US', // Change this to your desired language code
    };

    const request = {
        audio: audio,
        config: config,
    };

    // console.log('Request:', request); // Log the request to see its structure

    // Detects speech in the audio file
    try {
        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        console.log(`Transcription: ${transcription}`);
    } catch (error) {
        console.error('Error during transcription:', error);
    }
}

// Call the function to transcribe audio
transcribeAudio().catch(console.error);