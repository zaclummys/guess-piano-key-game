import {
    ArrowRight,
    RotateCcw,
    CircleCheck,
    CircleX,
} from 'lucide-react';

import { Button } from '../buttons';

import Screen from './screen';
import AnswerHistory from './answer-history';

export default function GameScreen ({
    score,
    round,
    streak,
    answerHistory,
    guessKeyChoices,
    onReplayButtonClick,
    onSkipButtonClick,
    onGuessKeyButtonClick,
    onRestartButtonClick,
}) {
    const lastAnswers = answerHistory.slice(-10);
    
    return (
        <Screen>
            <div className="flex-1 flex flex-row p-4">
                <div className="absolute left-4 top-4">
                    <AnswerHistory
                        history={lastAnswers}
                    />
                </div>

                <div className="flex-1 flex flex-col gap-4 items-center justify-center">
                    <span className="flex-1 flex items-end text-5xl font-bold">
                        Guess the key!
                    </span>

                    <div
                        className="flex flex-row gap-2 gap-4">
                        <Button
                            className="bg-gray-500 hover:bg-gray-600"
                            onClick={onReplayButtonClick}>
                            <RotateCcw /> Replay
                        </Button>

                        <Button
                            className="bg-gray-500 rounded hover:bg-gray-600"
                            onClick={onSkipButtonClick}>
                            <ArrowRight /> Skip
                        </Button>
                    </div>

                    <div className="flex-1 flex items-center">
                        <GameStats
                            score={score}
                            round={round}
                            streak={streak}
                        />
                    </div>
                </div>

                <div className="absolute right-4 top-4">
                    <Button
                        onClick={onRestartButtonClick}
                        className="bg-gray-500 rounded hover:bg-gray-600">
                        Stop
                    </Button>
                </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 mt-auto">
                <span className="text-center text-2xl font-semibold">
                    Which key did you hear?
                </span>
                <GuessKeyButtons
                    guessKeyChoices={guessKeyChoices}
                    onGuessKeyButtonClick={onGuessKeyButtonClick}
                />
            </div>
        </Screen>
    );
}

function GameStats ({
    score,
    round,
    streak,
}) {
    return (
        <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-1 items-center">
                <span className="text-2xl font-bold text-gray-600">
                    {score}
                </span>

                <span>
                    Score
                </span>
            </div>

            <div className="flex flex-col gap-1 items-center">
                <span className="text-2xl font-bold text-gray-600">
                    {streak}
                </span>
                
                <span>
                    Streak
                </span>
            </div>

            <div className="flex flex-col gap-1 items-center">
                <span className="text-2xl font-bold text-gray-600">
                    {round}
                </span>

                <span>
                    Round
                </span>
            </div>
        </div>
    );
}


function GuessKeyButtons ({
    guessKeyChoices,
    onGuessKeyButtonClick,
}) {
    return (
        <div className="flex flex-row p-2 gap-2">
            {guessKeyChoices.map(guessKey => (
                <GuessKeyButton
                    key={guessKey.note.name + guessKey.octave}
                    guessKey={guessKey}
                    onClick={onGuessKeyButtonClick}
                />
            ))}
        </div>
    );
}

function GuessKeyButton ({
    guessKey,
    onClick,
}) {
    return (
        <button
            onClick={event => onClick(event, guessKey)}
            className="flex-1 h-50 text-3xl font-bold cursor-pointer rounded focus:outline-none transition-colors duration-100 border-2 border-gray-300 hover:border-gray-400">
            {guessKey.note.name}{guessKey.octave}
        </button>
    );
}