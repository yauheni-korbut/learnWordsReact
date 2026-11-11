import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, message } from "antd";

import { wordService } from "../../../services/wordService";
import { getLoggedUserId, getShuffleWords } from "../../../utils/Helpers";

const withRouter = WrappedComponent => props => {
    const location = useLocation();

    return <WrappedComponent {...props} location={location} />;
};

const TrainingCard = ({ title, wordsData, trainingKey, setId, setTitle, setLocale }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [dueWordCount, setDueWordCount] = useState(null);

    useEffect(() => {
        let isMounted = true;
        wordService.previewTrainingRound({
            userId: getLoggedUserId(), setId, trainingKey,
        }).then(({ data }) => {
            if (isMounted) setDueWordCount(data.wordCount);
        }).catch(() => {
            if (isMounted) setDueWordCount(null);
        });
        return () => { isMounted = false; };
    }, [setId, trainingKey]);

    const textStyle = {
        fontSize: 25,
    }

    const handleOpenTraining = async () => {
        if (isLoading || !wordsData.length) return;
        setIsLoading(true);
        try {
            const { data } = await wordService.startTrainingRound({
                userId: getLoggedUserId(), setId, trainingKey,
            });
            if (!data.words.length) {
                message.info('There are no words in this set yet.');
                return;
            }
            navigate('/words/trainings/play', { state: {
                wordsData: data.allWords,
                wordsToLearn: getShuffleWords(data.words),
                round: data.round,
                setId,
                trainingKey,
                title,
                setTitle,
                setLocale,
            }});
        } catch (error) {
            message.error('Could not start training. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card
            className="training-mode-card"
            key={setId}
            title={title}
            style={{width: 300}}
            headStyle={{backgroundColor: 'rgba(24,144,255,0.42)', fontSize: 30}}
            hoverable={wordsData.length > 0 && !isLoading}
            onClick={handleOpenTraining}
            loading={isLoading}
        >
            <p style={textStyle}>{dueWordCount === null
                ? 'Words in next attempt: —'
                : `Words in next attempt: ${dueWordCount}`}</p>
            <p style={{ ...textStyle, fontSize: 18 }}>
                Review words are selected by your progress.
            </p>
        </Card>
    )
}

const TrainingCardWithRouter = withRouter(TrainingCard);

export {
    TrainingCardWithRouter,
}
