const correctSong = [
  { frequency: 523.25, duration: 200 }, // C5
  { frequency: 659.25, duration: 200 }, // E5
  { frequency: 783.99, duration: 200 }, // G5
];

const wrongSong = [
  { frequency: 392.00, duration: 200 }, // G4
  { frequency: 349.23, duration: 300 }, // F4
  { frequency: 329.63, duration: 400 }, // E4
];

const winningSong = [
  { frequency: 523.25, duration: 200 },   // C5
  { frequency: 659.25, duration: 200 },   // E5
  { frequency: 783.99, duration: 200 },   // G5
  { frequency: 1046.50, duration: 300 },  // C6
  { frequency: 880.00, duration: 200 },   // A5
  { frequency: 987.77, duration: 400 },   // B5
];

const losingSong = [
  { frequency: 440.00, duration: 300 }, // A4
  { frequency: 392.00, duration: 300 }, // G4
  { frequency: 349.23, duration: 300 }, // F4
  { frequency: 329.63, duration: 400 }, // E4
  { frequency: 261.63, duration: 500 }, // C4
];

let answerAudioCtx = null;
let activeOscillators = [];

function playAnswerSong(song) {
    stopSong(); // Stop any existing song first

    answerAudioCtx = answerAudioCtx || new (window.AudioContext || window.webkitAudioContext)();
    let startTime = answerAudioCtx.currentTime;

    activeOscillators = [];

    song.forEach(({ frequency, duration }) => {
        const osc = answerAudioCtx.createOscillator();
        const gain = answerAudioCtx.createGain();

        osc.frequency.value = frequency;
        osc.type = "sine";
        
        gain.gain.setValueAtTime(1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration / 1000);

        osc.connect(gain);
        gain.connect(answerAudioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration / 1000);

        startTime += duration / 1000;

        activeOscillators.push(osc);
    });

    let totalDuration = song.reduce((acc, { duration }) => acc + duration, 0);
    return totalDuration;
}

export function playCorrectSong() {
    return playAnswerSong(correctSong);
}

export function playWrongSong() {
    return playAnswerSong(wrongSong);
}

export function playWinningSong() {
    return playAnswerSong(winningSong);
}

export function playLosingSong() {
    return playAnswerSong(losingSong);
}

export function stopSong () {
    console.info(`Stopping song... Active oscillators: ${activeOscillators.length}.`);

    while (activeOscillators.length > 0) {
        const osc = activeOscillators.pop();

        osc.stop();
    }
}