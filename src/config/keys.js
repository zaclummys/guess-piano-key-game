import notes from './notes.js';

const octaves = [1, 2, 3, 4, 5, 6, 7];

const keys = [];

for (const octave of octaves) {
    for (const note of notes) {
        const name = note.name + octave;
        const frequency = 440 * Math.pow(2, (octave - 4) + (notes.indexOf(note) - 9) / 12);

        keys.push({
            name,
            note,
            octave,
            frequency,
        });
    }
}

export default keys;