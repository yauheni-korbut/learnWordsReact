import { Modal } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircleTwoTone } from '@ant-design/icons';


const withRouter = WrappedComponent => props => {
    const location = useLocation();

    return <WrappedComponent {...props} location={location} />;
};

const ResultModal = ({ wordsData, trainingKey, title, setId, setTitle, setLocale, stateTrainingWordPage, setStateTrainingWordPage }) => {

    const { wordsLeftToLearn: wordsToLearn, isResultTrainingModalVisible, amountLeftWordsToLearn } = stateTrainingWordPage;
    const navigate = useNavigate();

    const handleGoToWordsPage = () => {
        setStateTrainingWordPage({ ...stateTrainingWordPage, isResultTrainingModalVisible: false })
        navigate('/set/words', { state: { set: { title: setTitle, id: setId, locale: setLocale } }} );
    };

    const handleTrainAgain = () => {
        setStateTrainingWordPage({ ...stateTrainingWordPage, isResultTrainingModalVisible: false });
        if (!wordsToLearn.length) {
            navigate('/set/words', { state: { set: { title: setTitle, id: setId, locale: setLocale } }} );
            return;
        }

        const stateToPass = {
            wordsData,
            wordsToLearn,
            setId,
            trainingKey,
            title,
            setTitle,
            setLocale,
        }
        navigate('/words/trainings/play', { state: stateToPass} );
    };

    return (
        <>
            {
                wordsToLearn.length
                    ? (<Modal
                        title="Result of training:"
                        visible={isResultTrainingModalVisible}
                        onOk={handleGoToWordsPage}
                        okText={'Go to words page'}
                        onCancel={handleTrainAgain}
                        cancelText={'Practice words again'}
                    >
                        <p>
                            {`${amountLeftWordsToLearn} words left to learn`}
                        </p>
                    </Modal>)
                    : (<Modal
                        title="Result of training:"
                        visible={isResultTrainingModalVisible}
                        onOk={handleGoToWordsPage}
                        okText={'Go to words page'}
                        onCancel={handleGoToWordsPage}
                        cancelButtonProps={{ style: { display: 'none' } }}
                    >
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                        <span style={{marginLeft: '10px'}}>
                            {`You know all words from this set`}
                        </span>
                    </Modal>)
            }
        </>
    )
}
const ResultModalWithRouter = withRouter(ResultModal);

export {
    ResultModalWithRouter,
}
