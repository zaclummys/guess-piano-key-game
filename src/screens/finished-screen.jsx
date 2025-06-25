import {
    X, 
    Check,
} from 'lucide-react';

import { BigButton } from '../buttons';

import Screen from './screen';
import AnswerHistory from './answer-history';

export default function FinishedScreen ({
    finished,
    answerHistory,
    numberOfCorrectAnswers,
    numberOfWrongAnswers,
    onRestartButtonClick,
}) {
    const percentageOfAcurracy = (100 * numberOfCorrectAnswers / (numberOfCorrectAnswers + numberOfWrongAnswers)).toFixed(0);

    return (
        <Screen>
            <div className="flex flex-col gap-6 items-center justify-center h-screen">
                <span className="text-4xl font-bold text-center">
                    {finished.won ? 'You won! 🎉' : 'You lost! 💥'}
                </span>

                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-row gap-4">
                        <span className="flex flex-row items-center gap-2 text-green-600">
                            <Check /> {numberOfCorrectAnswers} hits
                        </span>

                        <span className="flex flex-row items-center gap-2 text-red-600">
                            <X /> {numberOfWrongAnswers} misses
                        </span>

                        <span className="text-gray-600">
                            {percentageOfAcurracy}% accuracy
                        </span>
                    </div>


                    <span className="text-2xl font-semibold">
                        Thanks for playing!
                    </span>

                    <BigButton
                        className="text-white bg-gray-700 hover:bg-gray-900"
                        onClick={onRestartButtonClick}>
                        Restart Game
                    </BigButton>

                    
                    <div className="flex flex-col items-center">
                        <AnswerHistory
                            history={answerHistory}
                        />
                    </div>
                </div>
            </div>
        </Screen>
    );
}