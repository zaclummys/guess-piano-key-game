import usePiano from './hooks/use-piano';

import TitleScreen from './screens/title-screen';
import GameScreen from './screens/game-screen';
import AnswerScreen from './screens/answer-screen';
import FinishedScreen from './screens/finished-screen';

export default function App () {
    const {
        finished,
        streak,
        score,
        round,
        isStarted,
        start,
        stop,
        skipKey,
        replayKey,
        nextRound,
        guessKey,
        keyChoices,
        answer,
        answerHistory,
        numberOfCorrectAnswers,
        numberOfWrongAnswers,
    } = usePiano();

    const handleGuessNoteClick = (event, key) => {
        guessKey(key);
    }

    const handleReplayButtonClick = () => {
        replayKey();
    }

    const handleSkipButtonClick = () => {
        skipKey();
    }

    const handleStartButtonClick = (event, octaves) => {
        start(octaves);
    }

    const handleRestartButtonClick = () => {
        stop();
    };

    const handleNextRound = () => {
        nextRound();
    };

    if (!isStarted) {
        return (
            <TitleScreen
                onStartButtonClick={handleStartButtonClick}
            />
        );
    }

    if (answer) {
        return (
            <AnswerScreen
                answer={answer}
                onNextRound={handleNextRound}
            />
        );
    }

    if (finished) {
        return (
            <FinishedScreen
                finished={finished}
                answerHistory={answerHistory}
                numberOfCorrectAnswers={numberOfCorrectAnswers}
                numberOfWrongAnswers={numberOfWrongAnswers}
                onRestartButtonClick={handleRestartButtonClick}
            />
        );
    }

    return (
        <GameScreen
            numberOfCorrectAnswers={numberOfCorrectAnswers}
            numberOfWrongAnswers={numberOfWrongAnswers}
            score={score}
            round={round}
            streak={streak}
            guessKeyChoices={keyChoices}
            answerHistory={answerHistory}
            onSkipButtonClick={handleSkipButtonClick}
            onReplayButtonClick={handleReplayButtonClick}
            onGuessKeyButtonClick={handleGuessNoteClick}
            onRestartButtonClick={handleRestartButtonClick}
        />
    )
}

