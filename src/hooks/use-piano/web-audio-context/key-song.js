import { getMP3Url } from './mp3s';


let currentAudio = null;

export async function playKey (key) {
    console.log('Playing key:', key.name);

    stopKey();

    const mp3Url = getMP3Url(key);

    const audio = new Audio(mp3Url);

    audio.play();

    currentAudio = audio;
}

export function stopKey () {
    console.log('Stopping current key...');

    if (!currentAudio) {
        console.info('No key to stop. Just ignoring.');

        return;
    }

    currentAudio.pause();
    currentAudio.remove();

    currentAudio = null;
}
