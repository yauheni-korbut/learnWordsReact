import { useState } from "react";
import { Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import { wordService } from "../../../services/wordService";
import { getLoggedUserId, getShuffleWords } from "../../../utils/Helpers";

const ResultModal = ({ visible, wordsData, trainingKey, title, setId, setTitle, setLocale, round, dueWordCount, onClose }) => {
    const navigate = useNavigate();
    const [isStartingNextRound, setIsStartingNextRound] = useState(false);

    const handleGoToWordsPage = () => {
        onClose();
        navigate('/set/words', { state: { set: { title: setTitle, id: setId, locale: setLocale } } });
    };

    const handleStartNextRound = async () => {
        if (isStartingNextRound) return;
        setIsStartingNextRound(true);
        try {
            const { data } = await wordService.startTrainingRound({
                userId: getLoggedUserId(), setId, trainingKey,
            });
            if (!data.words.length) {
                message.info('There are no words in this set yet.');
                handleGoToWordsPage();
                return;
            }
            onClose();
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
            message.error('Could not start the next round. Please try again.');
        } finally {
            setIsStartingNextRound(false);
        }
    };

    return (
        <Modal
            title={`Round ${round} complete`}
            visible={visible}
            onOk={handleStartNextRound}
            okText={isStartingNextRound ? 'Starting…' : 'Start next round'}
            confirmLoading={isStartingNextRound}
            onCancel={handleGoToWordsPage}
            cancelText="Go to words page"
        >
            <p>{`You reviewed all ${dueWordCount} due words in this round.`}</p>
            <p>Correct answers return after progressively longer Fibonacci intervals. Incorrect answers are due in the next round.</p>
        </Modal>
    );
};

const ResultModalWithRouter = ResultModal;

export {
    ResultModalWithRouter,
}
