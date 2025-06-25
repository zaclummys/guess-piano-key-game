import { useEffect } from 'react';
import { PartyPopper, HeartCrack } from 'lucide-react';

import Screen from './screen';

export default function AnswerScreen ({
    answer,
    onNextRound,
}) {
    const answerColorClassNames = {
        correct: 'text-green-600 bg-green-100',
        wrong: 'text-red-600 bg-red-100',
        skip: 'text-gray-600 bg-gray-200',
    };

    const answerColorClassName = answerColorClassNames[answer.type];

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onNextRound();
        }, 2000);

        return () => {
            clearTimeout(timeoutId);
        }
    }, []);

    return (
        <Screen>
            <div
                className={`flex-1 flex flex-col gap-4 items-center justify-center bg-gray-100 ${answerColorClassName}`}>
                <span className="text-6xl font-bold">
                    <AnswerTitle answer={answer} />
                </span>

                {answer.type === 'correct' && (
                    <span className="text-2xl font-semibold">
                        It was {answer.correctKey.note.name}{answer.correctKey.octave}.
                    </span>
                )}

                {answer.type === 'wrong' && (
                    <span className="text-2xl font-semibold">
                        It was actually {answer.correctKey.note.name}{answer.correctKey.octave}.
                    </span>
                )}
            </div>
        </Screen>
    );
}

function AnswerTitle ({ answer }) {
    switch (answer.type) {
        case 'correct':
            return (
                <div className="flex flex-row items-center justify-center gap-4">
                    <span>
                        Great ear!
                    </span>

                    <PartyPopper className="w-15 h-15"  />
                </div>
            );

        case 'wrong':
            return (
                <div className="flex flex-row items-center justify-center gap-4">
                    <span>
                        Wrong...
                    </span>

                    <HeartCrack className="w-15 h-15"  />
                </div>
            );

        case 'skip':
            return 'Skipped';

        default:
            return null;
    }
}