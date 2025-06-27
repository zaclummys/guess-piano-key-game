import { useState } from 'react';

import keys from '../../config/keys';

import { random, shuffle } from '../../utils/array';

import {
    playCorrectSong,
    playWrongSong,
    playWinningSong,
    playLosingSong,
} from './web-audio-context/answer-song';

import {
    playKey,
    stopKey,
} from './web-audio-context/key-song';

function useRound () {
    const [round, setRound] = useState(1);

    const incrementRound = () => {
        setRound(previousRound => previousRound + 1);
    }

    const resetRound = () => {
        setRound(1);
    }

    return {
        round,
        resetRound,
        incrementRound,
    };
}

function useAnswerHistory () {
    const [answerHistory, setAnswerHistory] = useState([]);

    const addToAnswerHistory = (answer) => {
        setAnswerHistory(previousAnswerHistory => previousAnswerHistory.concat(answer));
    }

    const resetAnswerHistory = () => {
        setAnswerHistory([]);
    }

    const correctAnswers = answerHistory.filter(answer => answer.type === 'correct');
    const wrongAnswers = answerHistory.filter(answer => answer.type === 'wrong');

    return {
        answerHistory,
        addToAnswerHistory,
        resetAnswerHistory,
        numberOfCorrectAnswers: correctAnswers.length,
        numberOfWrongAnswers: wrongAnswers.length,
    };
}

function useStreak () {
    const [streak, setStreak] = useState(0);

    const incrementStreak = () => {
        setStreak(previousStreak => previousStreak + 1);
    }

    const resetStreak = () => {
        setStreak(0);
    }

    return {
        streak,
        incrementStreak,
        resetStreak,
    };
}

function useScore () {
    const [score, setScore] = useState(0);
    
    const incrementScore = (points) => {
        setScore(previousScore => previousScore + points);
    }

    const resetScore = () => {
        setScore(0);
    }

    return {
        score,
        incrementScore,
        resetScore,
    };
}

export default function usePiano () {
    const maxRound = 10;

    const [selectedOctaves, setSelectedOctaves] = useState([]);
    const [isBlackKeysIncluded, setIsBlackKeysIncluded] = useState(false);

    const [isStarted, setIsStarted] = useState(false);
    const [currentKey, setCurrentKey] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [keyChoices, setKeyChoices] = useState([]);
    const [finished, setFinished] = useState(false);

    const {
        answerHistory,
        addToAnswerHistory,
        resetAnswerHistory,
        numberOfCorrectAnswers,
        numberOfWrongAnswers,
    } = useAnswerHistory();

    const {
        streak,
        incrementStreak,
        resetStreak,
    } = useStreak();

    const {
        round,
        resetRound,
        incrementRound,
     } = useRound();

    const { score, incrementScore, resetScore } = useScore();

    const clearAnswer = () => {
        setAnswer(null);
    }

    const generateNewRandomKey = ({ selectedOctaves, isBlackKeysIncluded }) => {
        const octave = random(selectedOctaves);

        const candidateKeys = keys
            .filter(key => key.octave === octave)
            .filter(key => isBlackKeysIncluded || key.note.color === 'white');

        const shuffledCandidateKeys = shuffle(candidateKeys);

        const newKey = shuffledCandidateKeys.pop();
        const otherKey = shuffledCandidateKeys.pop();

        if (!newKey || !otherKey) {
            return;
        }

        const shuffledKeyChoices = shuffle([newKey, otherKey]);

        setCurrentKey(newKey);
        setKeyChoices(shuffledKeyChoices);

        playKey(newKey);
    }

    const start = ({ selectedOctaves, isBlackKeysIncluded }) => {
        if (isStarted) {
            return;
        }

        setIsStarted(true);

        setSelectedOctaves(selectedOctaves);
        setIsBlackKeysIncluded(isBlackKeysIncluded);

        generateNewRandomKey({
            selectedOctaves,
            isBlackKeysIncluded,
        });
    }

    const stop = () => {
        resetAnswerHistory();

        resetScore();
        resetRound();
        resetStreak();

        setFinished(false);
        setIsStarted(false);
        setCurrentKey(null);
        setKeyChoices([]);
        setAnswer(null);
    }

    const finish = () => {
        let numberOfCorrectAnswers = answerHistory.filter(a => a.type === 'correct').length;
        let numberOfWrongAnswers = answerHistory.filter(a => a.type === 'wrong').length;

        const won = numberOfCorrectAnswers > numberOfWrongAnswers;

        if (won) {
            playWinningSong();
        } else {
            playLosingSong();
        }

        setFinished({
            won
        });
    };

    const replayKey = () => {
        if (!isStarted || !currentKey) {
            return;
        }

        playKey(currentKey);
    }

    const newKey = () => {
        if (!isStarted) {
            return;
        }

        generateNewRandomKey({
            selectedOctaves,
            isBlackKeysIncluded,
        });
        clearAnswer();
    }

    const guessKey = (guessingKey) => {
        stopKey();

        if (guessingKey.note === currentKey.note) {
            playCorrectSong();
        } else {
            playWrongSong();
        }
        
        const isCorrect = guessingKey.note === currentKey.note;

        const answer = {
            type: isCorrect ? 'correct' : 'wrong',
            guessedKey: guessingKey,
            correctKey: currentKey,
        };

        setAnswer(answer);
        addToAnswerHistory(answer);

        if (isCorrect) {
            incrementStreak();
            incrementScore(10 + (streak * 2));
        } else {
            resetStreak();
        }
    }

    const nextRound = () => {
        clearAnswer();

        console.info('Going to next round', round, maxRound);

        if (round < maxRound) {
            incrementRound();
            newKey();
        } else {
            finish();
        }
    }

    const skipKey = () => {
        const answer = {
            type: 'skip',
            guessedKey: null,
            correctKey: currentKey,
        };
        
        setAnswer(answer);
        addToAnswerHistory(answer);

        setTimeout(() => {
            newKey();
        }, 1000);
    }

    return {
        finished,
        score,
        streak,
        round,
        numberOfCorrectAnswers,
        numberOfWrongAnswers,
        keyChoices,
        isStarted,
        start,
        stop,
        guessKey,
        replayKey,
        skipKey,
        answer,
        answerHistory,
        nextRound,
    };
}