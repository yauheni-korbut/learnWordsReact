import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, message, Progress } from 'antd';

import { AnswersCollection } from "../AnswersCollection/AnswersCollections";
import { ResultModalWithRouter } from "../ResultModal/ResultModal";
import { getImgURL, getShuffleWords, getTitleForCard } from '../../../utils/Helpers';

const TRAINING_PLACEHOLDER_IMAGE = "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3RqcDhlOXd6Zjlxc3hmOG5uNTBlYnk2N3h2MWpuZWM0MHVtaGNoayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjI6SIIHBdRxXI40/giphy.gif";

const getAnswersForCurrentWord = (currentWord, wordsData) => {
    const remainingWords = wordsData.filter(word => word.id !== currentWord.id);
    const answers = [currentWord];
    while (answers.length < Math.min(5, wordsData.length) && remainingWords.length) {
        const index = Math.floor(Math.random() * remainingWords.length);
        answers.push(...remainingWords.splice(index, 1));
    }
    return getShuffleWords(answers);
}

const TrainingWordPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const {
        wordsData = [], wordsToLearn = [], round, setId,
        trainingKey, title, setTitle, setLocale,
    } = state || {};
    const [indexOfCurrentWord, setIndexOfCurrentWord] = useState(0);
    const [isCurrentWordAnswered, setIsCurrentWordAnswered] = useState(false);
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
    const [isResultTrainingModalVisible, setIsResultTrainingModalVisible] = useState(false);

    useEffect(() => {
        setIndexOfCurrentWord(0);
        setIsCurrentWordAnswered(false);
        setIsAnswerRevealed(false);
        setIsResultTrainingModalVisible(false);
    }, [setId, trainingKey, round]);

    const currentWord = wordsToLearn[indexOfCurrentWord];
    const answersArray = useMemo(
        () => currentWord ? getAnswersForCurrentWord(currentWord, wordsData) : [],
        [currentWord, wordsData]
    );

    if (!state || !currentWord) {
        return (
            <div className="site-layout-background" style={{ padding: 24, minHeight: '82vh', marginTop: 16 }}>
                <p>There are no words in this training round.</p>
                <Button onClick={() => navigate('/sets')}>Back to sets</Button>
            </div>
        );
    }

    const reviewedWords = indexOfCurrentWord + (isCurrentWordAnswered ? 1 : 0);
    const reviewedPercent = Math.round((reviewedWords / wordsToLearn.length) * 100);

    const handleNextWord = () => {
        if (!isCurrentWordAnswered) {
            message.info('Choose an answer before moving to the next word.');
            return;
        }
        if (indexOfCurrentWord + 1 < wordsToLearn.length) {
            setIndexOfCurrentWord(indexOfCurrentWord + 1);
            setIsCurrentWordAnswered(false);
            setIsAnswerRevealed(false);
            return;
        }
        setIsResultTrainingModalVisible(true);
    };

    const handleCloseTraining = () => {
        navigate('/words/trainings', { state: { wordsData, set: { setId, setTitle, setLocale } } });
    };

    return (
        <div className="site-layout-background training-play-page"
             style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 24, minHeight: '82vh', marginTop: 16 }}
             tabIndex="0">
            <div className="training-question-layout" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Card className="training-visual-card" style={{ width: "60%" }}>
                    <div style={{ width: "90%", height: 400, overflow: "hidden" }}>
                        <img
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            alt={currentWord.meaning}
                            src={isAnswerRevealed ? getImgURL(currentWord.meaning) : TRAINING_PLACEHOLDER_IMAGE}
                        />
                    </div>
                </Card>
                <Card className="training-answer-card" title={getTitleForCard(trainingKey, currentWord)}
                      style={{ width: "60%", textAlign: 'center', fontSize: "25px" }}
                      headStyle={{ backgroundColor: 'rgba(24,144,255,0.42)', textAlign: 'center' }}
                      key={`${round}-${currentWord.id}`}>
                    <AnswersCollection
                        key={`${round}-${currentWord.id}`}
                        wordsData={wordsData}
                        trainingKey={trainingKey}
                        currentWord={currentWord}
                        answersArray={answersArray}
                        setId={setId}
                        setLocale={setLocale}
                        round={round}
                        onAnswerSaved={() => setIsCurrentWordAnswered(true)}
                        onAnswerRevealed={setIsAnswerRevealed}
                    />
                </Card>
            </div>
            <div className="training-play-controls" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                <Button danger onClick={handleCloseTraining}>Close the training</Button>
                <div className="training-progress-wrap">
                    <span className="training-progress-label">{`${reviewedWords} of ${wordsToLearn.length} words reviewed`}</span>
                    <Progress percent={reviewedPercent} showInfo={false} size="large" />
                </div>
                <Button type="primary" onClick={handleNextWord} disabled={!isCurrentWordAnswered}>
                    {indexOfCurrentWord + 1 < wordsToLearn.length ? 'Next word' : 'Finish round'}
                </Button>
            </div>
            <ResultModalWithRouter
                visible={isResultTrainingModalVisible}
                wordsData={wordsData}
                trainingKey={trainingKey}
                title={title}
                setId={setId}
                setTitle={setTitle}
                setLocale={setLocale}
                round={round}
                dueWordCount={wordsToLearn.length}
                onClose={() => setIsResultTrainingModalVisible(false)}
            />
        </div>
    )
}

export {
    TrainingWordPage,
}
