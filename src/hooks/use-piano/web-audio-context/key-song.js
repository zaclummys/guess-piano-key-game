const playKeyAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
const loadedMP3Keys = [];

function buildMP3KeyUrl (key) {
    let name = (key.note.bemolName || key.note.name) + key.octave;
    return `/mp3/${name}.mp3`;
}

async function loadMP3Key(key) {
    const url = buildMP3KeyUrl(key);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load MP3 for key ${key.name}: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await playKeyAudioCtx.decodeAudioData(arrayBuffer);

    return {
        key,
        audioBuffer,
    };
}

async function loadCachedMP3Key(key) {
    const existing = loadedMP3Keys.find(mp3Key => mp3Key.key === key);
    if (existing && existing.audioBuffer) {
        return existing;
    }

    const mp3Key = await loadMP3Key(key);
    loadedMP3Keys.push(mp3Key);
    return mp3Key;
}

let currentSource = null;
let currentGain = null;
let stopTimeout = null;

const MAX_DURATION = 10; // seconds

export async function playKey(key) {
    // Stop previous audio if needed
    stopKey();

    const mp3Key = await loadCachedMP3Key(key);

    if (!mp3Key || !mp3Key.audioBuffer) {
        console.error(`Audio buffer for key ${key.name} not available.`);
        return;
    }

    const source = playKeyAudioCtx.createBufferSource();
    const gainNode = playKeyAudioCtx.createGain();

    source.buffer = mp3Key.audioBuffer;
    source.connect(gainNode);
    gainNode.connect(playKeyAudioCtx.destination);

    source.start();

    currentSource = source;
    currentGain = gainNode;

    // Auto-stop after MAX_DURATION seconds
    stopTimeout = setTimeout(() => {
        fadeOutAndStop(source, gainNode);
    }, MAX_DURATION * 1000);

    console.log(`Playing ${key.note.name}${key.octave} for up to ${MAX_DURATION} seconds`);

    return () => stopKey(); // Return manual stop function
}

export function stopKey() {
    if (stopTimeout) {
        clearTimeout(stopTimeout);
        stopTimeout = null;
    }

    if (currentSource && currentGain) {
        fadeOutAndStop(currentSource, currentGain);
    }
}

function fadeOutAndStop(source, gainNode) {
    const fadeDurationInSeconds = 1; // seconds

    if (!source || !gainNode) {
        console.warn('No audio source or gain node to stop.');
        return;
    }

    const now = playKeyAudioCtx.currentTime;

    try {
        const currentGainValue = gainNode.gain.value || 1;
        gainNode.gain.setValueAtTime(currentGainValue, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + fadeDurationInSeconds);
        source.stop(now + fadeDurationInSeconds);
    } catch (e) {
        console.warn("Error during graceful stop:", e);
    }

    // Disconnect after fade completes
    setTimeout(() => {
        try {
            source.disconnect();
            gainNode.disconnect();
        } catch (e) {
            console.warn("Error disconnecting nodes:", e);
        }
        currentSource = null;
        currentGain = null;
        console.log(`Stopped key song (gracefully)`);
    }, fadeDurationInSeconds * 1000);
}
