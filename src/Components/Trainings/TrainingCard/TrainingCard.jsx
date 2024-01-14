import { useLocation, useNavigate } from "react-router-dom";
import { Card, Popconfirm, Progress } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from "uuid";

//helpers
import { getShuffleWords } from "../../../utils/Helpers";
import { Logger } from "../../../utils/logger";

const MODULE_NAME = 'TrainingCard'

const withRouter = WrappedComponent => props => {
    const location = useLocation();

    return <WrappedComponent {...props} location={location} />;
};

const TrainingCard = ({ title, wordsData, trainingKey, setId, setTitle, setLocale }) => {

    const navigate = useNavigate();

    const wordsToLearn = getShuffleWords(wordsData).filter(wordData => !wordData[trainingKey]);
    const learnedWords = wordsData.length - wordsToLearn.length;
    const successPercent = Math.floor(learnedWords / wordsData.length * 100);

    const textStyle = {
        fontSize: 25,
    }

    const handleOpenTraining = () => {
        if (!wordsToLearn.length) {
            Logger.info(MODULE_NAME, 'handleOpenTraining', 'You already learn all words!');
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
    }

    return (
        <Popconfirm
            title="You already learn all words!"
            icon={<InfoCircleOutlined />}
            showCancel={false}
        >

            <Card
                key={uuidv4()}
                title={title}
                style={{width: 300}}
                headStyle={{backgroundColor: 'rgba(24,144,255,0.42)', fontSize: 30}}
                hoverable={true}
                onClick={handleOpenTraining}
            >
                <p style={textStyle}>
                    {`All words: ${wordsData.length}`}
                </p>
                <p style={textStyle}>
                    {`Already learned: ${learnedWords}`}
                </p>
                <p style={textStyle}>
                    {`To learn: ${wordsToLearn.length}`}
                </p>
                <div style={{width: '100%'}}>
                    <Progress percent={successPercent} size="large" />
                </div>
            </Card>
        </Popconfirm>
    )
}

const TrainingCardWithRouter = withRouter(TrainingCard);

export {
    TrainingCardWithRouter,
}
