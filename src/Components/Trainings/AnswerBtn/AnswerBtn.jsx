import { Card } from "antd";

// Components
import { wordService } from '../../../services/wordService'
import {currentUserKey} from "../../../services/serviceConstants";

// Helpers
import { isEnLocale, isRuEnTraining, getImgURL, getAnswerBtnBackgroundColor } from "../../../utils/Helpers";
import {Logger} from "../../../utils/logger";
import { useSpeechSynthesis } from '../../../hooks/useSpeechSynthesis';

const MODULE_NAME = 'AnswerBtn';

const AnswerBtn = ({ answerNumber, answerData, trainingKey, currentWord, setId, setLocale, answerCollectionState, setAnswerCollectionState, isThisBtnChosenAsCorrectAnswer, isThisBtnWasChosen, isThisBtnShouldBeCorrectAnswer }) => {
    const { speak, appVoices } = useSpeechSynthesis();

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

    const handleClickAnswer = (e) => {
        e.stopPropagation();
        document.getElementsByTagName('img')[0].src = getImgURL(document.getElementsByTagName('img')[0].alt);
        const isRightAnswer = answerData.id === currentWord.id;
        const userId = JSON.parse(localStorage.getItem(currentUserKey)).id;
        const newWordsData = {
            id: currentWord.id,
            [trainingKey]: isRightAnswer,
        }

        setAnswerCollectionState({
            ...answerCollectionState,
            isAnswerChosen: true,
            chosenAnswerId: answerData.id,
        });

        speak({ text: currentWord.word, voice })

        if (isRightAnswer) {
            wordService.updateWord({ userId, setId, body: newWordsData })
                .then(() => Logger.info(MODULE_NAME, 'handleClickAnswer', 'word data was updated'))
                .catch(error => Logger.error(MODULE_NAME, 'handleClickAnswer', 'word was not updated, error occur: ', error));
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
