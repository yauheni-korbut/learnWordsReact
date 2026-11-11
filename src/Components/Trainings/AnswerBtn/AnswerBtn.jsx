import { useRef } from "react";
import { Card, message } from "antd";

// Components
import { wordService } from '../../../services/wordService'

// Helpers
import { isEnLocale, isRuEnTraining, getAnswerBtnBackgroundColor, getLoggedUserId } from "../../../utils/Helpers";
import {Logger} from "../../../utils/logger";
import { useSpeechSynthesis } from '../../../hooks/useSpeechSynthesis';

const MODULE_NAME = 'AnswerBtn';

const AnswerBtn = ({ answerNumber, answerData, trainingKey, currentWord, setId, setLocale, round, onAnswerSaved, onAnswerRevealed, answerCollectionState, setAnswerCollectionState, isThisBtnChosenAsCorrectAnswer, isThisBtnWasChosen, isThisBtnShouldBeCorrectAnswer }) => {
    const { speak, appVoices } = useSpeechSynthesis();
    const isSubmittingAnswer = useRef(false);

    const answer = isRuEnTraining(trainingKey) ? answerData.word : answerData.meaning;
    const backgroundColor = getAnswerBtnBackgroundColor(answerCollectionState.isAnswerChosen, isThisBtnWasChosen, isThisBtnChosenAsCorrectAnswer, isThisBtnShouldBeCorrectAnswer);

    const gridStyle = {
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        padding: '15px 10px 15px 15px',
        backgroundColor,
    };

    const voice = isEnLocale(setLocale) ? appVoices.englishVoice : appVoices.polishVoice;

    const handleClickAnswer = async (e) => {
        e.stopPropagation();
        if (answerCollectionState.isAnswerChosen || isSubmittingAnswer.current) return;
        isSubmittingAnswer.current = true;
        const isRightAnswer = answerData.id === currentWord.id;
        setAnswerCollectionState({
            isAnswerChosen: true,
            chosenAnswerId: answerData.id,
        });
        onAnswerRevealed(true);
        speak({ text: currentWord.word, voice });
        try {
            await wordService.submitTrainingAnswer({
                userId: getLoggedUserId(), setId, wordId: currentWord.id,
                trainingKey, round, correct: isRightAnswer,
            });
            onAnswerSaved();
        } catch (error) {
            setAnswerCollectionState({ isAnswerChosen: false, chosenAnswerId: '' });
            onAnswerRevealed(false);
            Logger.error(MODULE_NAME, 'handleClickAnswer', error);
            message.error('Your answer could not be saved. Please try again.');
        } finally {
            isSubmittingAnswer.current = false;
        }
    }
    return (
        <Card.Grid
            key={answer}
            style={gridStyle}
            onClick={answerCollectionState.isAnswerChosen ? () => {} : handleClickAnswer}
            hoverable={!answerCollectionState.isAnswerChosen}
        >
            <span style={{ marginRight: '20px' }}>{ answerNumber }.</span>
            <span>{ answer }</span>
        </Card.Grid>
    )
}

export {
    AnswerBtn,
}
