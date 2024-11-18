import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Button, Card, Progress } from 'antd';

// Components
import { AnswersCollection } from "../AnswersCollection/AnswersCollections";
import { ResultModalWithRouter } from "../ResultModal/ResultModal";

// Services
import { wordService } from "../../../services/wordService";

// Helpers
import { getShuffleWords, getTitleForCard } from '../../../utils/Helpers';
import { Logger } from "../../../utils/logger";

// Constants
import { currentUserKey } from "../../../services/serviceConstants";

const MODULE_NAME = 'TrainingWordPage';

const getAnswersForCurrentWord = (currentWord, wordsData) => {
    const copyWordsData = [...wordsData];
    const currentWordIndex = copyWordsData.findIndex(item => item.id === currentWord.id);
    const answers = copyWordsData.splice(currentWordIndex, 1);

    while (wordsData.length > 5 ? (answers.length < 5) : (answers.length < wordsData.length)) {
        const index = Math.floor(Math.random() * copyWordsData.length);
        answers.push(...copyWordsData.splice(index, 1));
    }

    return getShuffleWords(answers);
}

const TrainingWordPage = () => {
    const userId = JSON.parse(localStorage.getItem(currentUserKey)).id;

    const navigate = useNavigate();

    const { state } = useLocation();
    const { wordsData, wordsToLearn, setId, trainingKey, title, setTitle, setLocale } = state;

    const initialTrainingWordPageState = {
        indexOfCurrentWord: 0,
        currentWord: wordsToLearn[0],
        isResultTrainingModalVisible: false,
        wordsLeftToLearn: wordsToLearn,
        wordsData,
        amountLeftWordsToLearn: wordsToLearn.length,
    }

    async function initWordsData() {
        const { wordsLeftToLearn, allWordsData } = await getLeftWordsToLearn()
        setStateTrainingWordPage({
            ...stateTrainingWordPage,
            wordsLeftToLearn: wordsLeftToLearn,
            wordsData: allWordsData,
            amountLeftWordsToLearn: wordsLeftToLearn.length,
        })
    }

    useEffect(() => {
        initWordsData();
    }, [])

    const [stateTrainingWordPage, setStateTrainingWordPage] = useState(initialTrainingWordPageState);

    const { indexOfCurrentWord, currentWord } = stateTrainingWordPage;

    const answersArray = getAnswersForCurrentWord(currentWord, wordsData);

    const getLeftWordsToLearn = async () => {
        const { data } = await wordService.getAllSetWords(userId, setId);
        const wordsLeftToLearn = data.filter(wordData => !wordData[trainingKey]);
        return { wordsLeftToLearn, allWordsData: data};
    }

    const showNextWord = () => {
        document.getElementsByTagName('img')[0].src = "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3RqcDhlOXd6Zjlxc3hmOG5uNTBlYnk2N3h2MWpuZWM0MHVtaGNoayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjI6SIIHBdRxXI40/giphy.gif"
        setTimeout(() => {
            getLeftWordsToLearn()
                .then(({ wordsLeftToLearn, allWordsData }) => {
                    const nextIndex = indexOfCurrentWord + 1;
                    if (wordsToLearn[nextIndex]) {
                        setStateTrainingWordPage({
                            ...stateTrainingWordPage,
                            indexOfCurrentWord: nextIndex,
                            currentWord: wordsToLearn[nextIndex],
                            amountLeftWordsToLearn: wordsLeftToLearn.length,
                        })
                    } else {
                        const shuffledWordsToLearn = getShuffleWords(wordsLeftToLearn);
                        setStateTrainingWordPage({
                            ...stateTrainingWordPage,
                            indexOfCurrentWord: 0,
                            currentWord: shuffledWordsToLearn[0] || stateTrainingWordPage.currentWord,
                            isResultTrainingModalVisible: true,
                            wordsLeftToLearn: shuffledWordsToLearn,
                            wordsData: allWordsData,
                            amountLeftWordsToLearn: shuffledWordsToLearn.length,
                        })
                    }
                })
        }, 200)
    }

    const handleCloseTraining = () => {
        Logger.info(MODULE_NAME, 'handleCloseTraining');
        getLeftWordsToLearn()
            .then(({ allWordsData: wordsData }) => {
                navigate('/words/trainings', { state: { wordsData, set: { setId, setTitle, setLocale } } } );
        })
    }

    const amountWordsToLearn =  stateTrainingWordPage.amountLeftWordsToLearn;
    const learnedWords =  wordsData.length - amountWordsToLearn;
    const learnedWordsPercent =  (learnedWords / wordsData.length) * 100;


    return (
        <div className="site-layout-background"
             style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 24, minHeight: '82vh', marginTop: 16 }}
             tabIndex="0"
        >
            <p style={{ marginBottom: 20, fontSize: 30 }}>{`${title} training for set '${setTitle}'`}</p>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Card style={{ width: "60%" }} >
                    <div   style={{ width: "90%", height: 400, overflow: "hidden" }}>
                        <img
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            alt={currentWord.meaning}
                            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3RqcDhlOXd6Zjlxc3hmOG5uNTBlYnk2N3h2MWpuZWM0MHVtaGNoayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjI6SIIHBdRxXI40/giphy.gif"
                        />
                    </div>
                </Card>
                <Card title={ getTitleForCard(trainingKey, currentWord) }
                      style={{ width: "60%", textAlign: 'center', fontSize: "25px" }}
                      headStyle={{
                          backgroundColor: 'rgba(24,144,255,0.42)',
                          textAlign: 'center',
                      }}
                      key={currentWord.id}
                >
                    <AnswersCollection wordsData={wordsData} trainingKey={trainingKey} currentWord={currentWord} answersArray={answersArray} setId={setId} setLocale={setLocale}/>
                </Card>
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                <Button danger onClick={handleCloseTraining}>Close the training</Button>
                <div style={{ width: '50%', display: 'flex', alignItems: 'center' }}>
                    <Progress percent={learnedWordsPercent} format={() => `${learnedWords} of ${wordsData.length} words learned`} size="large" />
                </div>
                <Button type="primary" onClick={showNextWord}>Next word</Button>
            </div>
            <ResultModalWithRouter
                wordsData={wordsData}
                trainingKey={trainingKey}
                title={title}
                setId={setId}
                setTitle={setTitle}
                setLocale={setLocale}
                stateTrainingWordPage={stateTrainingWordPage}
                setStateTrainingWordPage={setStateTrainingWordPage}
            />
        </div>

    )
}

export {
    TrainingWordPage,
}
