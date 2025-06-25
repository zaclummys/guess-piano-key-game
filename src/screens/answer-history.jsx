import { CircleCheck, CircleX } from 'lucide-react';

export default function AnswerHistory ({ history }) {
    return (
        <div className="flex flex-col items-stretch gap-2">
            {history.map((answer, index) => (
                <AnswerHistoryItem
                    key={index}
                    answer={answer}
                />
            ))}
        </div>
    );
}


function AnswerHistoryItem ({ answer }) {
    const colorClassNames = {
        correct: 'text-green-600',
        wrong: 'text-red-600',
        skip: 'text-gray-600',
    };

    const colorClassName = colorClassNames[answer.type];

    return (
        <div
            className={`flex-1 flex items-center justify-center gap-2 leading-none rounded ${colorClassName}`}>
            <span className="text-xl">
                <AnswerHistoryIcon type={answer.type} />
            </span>

            {answer.type !== 'skip' && (
                <span className="flex-1 text-sm font-semibold">
                    {answer.type === 'correct' && (
                        <>
                            {answer.correctKey.note.name}{answer.correctKey.octave}
                        </>
                    )}

                    {answer.type === 'wrong' && (
                        <>
                            {answer.guessedKey.note.name}{answer.guessedKey.octave} ({answer.correctKey.note.name}{answer.correctKey.octave})
                        </>
                    )}
                </span>
            )}
        </div>
    );
}

function AnswerHistoryIcon ({ type }) {
    switch (type) {
        case 'correct':
            return <CircleCheck className="text-green-600" />;
        case 'wrong':
            return <CircleX className="text-red-600" />;
        case 'skip':
            return <CircleCheck className="text-gray-600" />;
        default:
            return null;    
    }
}
