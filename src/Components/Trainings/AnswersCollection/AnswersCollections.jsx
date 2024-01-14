import {useState} from "react";

//Components
import { AnswerBtn } from "../AnswerBtn/AnswerBtn";

const AnswersCollection = ({ trainingKey, currentWord, answersArray, setId, setLocale }) => {

    const initialState = {
        isAnswerChosen: false,
        chosenAnswerId: '',
    }

    const [answerCollectionState, setAnswerCollectionState] = useState(initialState);

    const isAnswerCorrect = (chosenAnswerId) => chosenAnswerId === currentWord.id;

    const isThisBtnChosen = (chosenAnswerId, btnData) => chosenAnswerId === btnData.id;

    const isThisBtnCorrectAnswer = (btnData) => btnData.id === currentWord.id;

    const answersComponents = answersArray.map((answerData, index) => {
        const isThisBtnChosenAsCorrectAnswer = isAnswerCorrect(answerCollectionState.chosenAnswerId);
        const isThisBtnWasChosen = isThisBtnChosen(answerCollectionState.chosenAnswerId, answerData);
        const isThisBtnShouldBeCorrectAnswer = isThisBtnCorrectAnswer(answerData);
        return (
            <AnswerBtn  answerNumber={index + 1} answerData={answerData} trainingKey={trainingKey} currentWord={currentWord} setId={setId} setLocale={setLocale}
                        answerCollectionState={answerCollectionState} setAnswerCollectionState={setAnswerCollectionState}
                        isThisBtnChosenAsCorrectAnswer={isThisBtnChosenAsCorrectAnswer} isThisBtnWasChosen={isThisBtnWasChosen} isThisBtnShouldBeCorrectAnswer={isThisBtnShouldBeCorrectAnswer}/>
        )
    })

    return (
        <>
            { answersComponents }
        </>
    );
}

export {
    AnswersCollection,
}
