import {useState} from "react";

//Components
import { AnswerBtn } from "../AnswerBtn/AnswerBtn";

const AnswersCollection = ({ trainingKey, currentWord, answersArray, setId, setLocale, round, onAnswerSaved, onAnswerRevealed }) => {

    const initialState = {
        isAnswerChosen: false,
        chosenAnswerId: '',
    }

    const [answerCollectionState, setAnswerCollectionState] = useState(initialState);

    const isAnswerCorrect = (chosenAnswerId) => chosenAnswerId === currentWord.id;

    const isThisBtnChosen = (chosenAnswerId, btnData) => chosenAnswerId === btnData.id;

    const isThisBtnCorrectAnswer = (btnData) => btnData.id === currentWord.id;
    const exampleSentences = [currentWord.example1, currentWord.example2, currentWord.example3]
        .filter(sentence => sentence && sentence.trim());

    const answersComponents = answersArray.map((answerData, index) => {
        const isThisBtnChosenAsCorrectAnswer = isAnswerCorrect(answerCollectionState.chosenAnswerId);
        const isThisBtnWasChosen = isThisBtnChosen(answerCollectionState.chosenAnswerId, answerData);
        const isThisBtnShouldBeCorrectAnswer = isThisBtnCorrectAnswer(answerData);
        return (
            <AnswerBtn  key={answerData.id} answerNumber={index + 1} answerData={answerData} trainingKey={trainingKey} currentWord={currentWord} setId={setId} setLocale={setLocale} round={round} onAnswerSaved={onAnswerSaved} onAnswerRevealed={onAnswerRevealed}
                        answerCollectionState={answerCollectionState} setAnswerCollectionState={setAnswerCollectionState}
                        isThisBtnChosenAsCorrectAnswer={isThisBtnChosenAsCorrectAnswer} isThisBtnWasChosen={isThisBtnWasChosen} isThisBtnShouldBeCorrectAnswer={isThisBtnShouldBeCorrectAnswer}/>
        )
    })

    return (
        <>
            { answersComponents }
            {answerCollectionState.isAnswerChosen && exampleSentences.length > 0 && (
                <div className="training-example-list">
                    <div className="training-example-heading">Examples</div>
                    {exampleSentences.map((sentence, index) => (
                        <p key={index}>{sentence}</p>
                    ))}
                </div>
            )}
        </>
    );
}

export {
    AnswersCollection,
}
