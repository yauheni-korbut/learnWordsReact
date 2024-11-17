import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Table, Space, Button, Tooltip, Popconfirm, Input, Modal, Card, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

// Services
import { wordService } from "../../../services/wordService";

// Constants
import { currentUserKey } from "../../../services/serviceConstants";

// Helpers
import { isThereWordsToLearnInSet, isEnLocale, getImgURL, getLoggedUserId } from "../../../utils/Helpers";
import { Logger } from "../../../utils/logger";

// Components
import { ButtonModalAddWords } from "../ButtonModalAddWords/ButtonModalAddWords";
import { useSpeechSynthesis } from '../../../hooks/useSpeechSynthesis';

const { confirm } = Modal;

const MODULE_NAME = 'wordsPage';

const styleContainer = {
    padding: 24,
    minHeight: '81vh',
    marginTop: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}

const YOU_LEARNED_ALL_WORDS_FROM_THIS_SET = 'You already learned all words from this set';

const withRouter = WrappedComponent => props => {
    const location = useLocation();

    return <WrappedComponent {...props} location={location} />;
};

const WordsPage = () => {
    const { state } = useLocation();
    const { id: setId, title: setTitle, locale: setLocale } = state.set;

    const [wordsData, setWordsData] = useState([]);

    const [cardWord, setCardWord] = useState('');
    const [cardTranscription, setCardTranscription] = useState('');
    const [cardMeaning, setCardMeaning] = useState('');
    const [cardId, setCardId] = useState();

    const { speak, appVoices } = useSpeechSynthesis();

  const voice = isEnLocale(setLocale) ? appVoices.englishVoice : appVoices.polishVoice;

    const navigate = useNavigate();

    async function getWordsData() {
        const userId = JSON.parse(localStorage.getItem(currentUserKey)).id;
        const { data } = await wordService.getAllSetWords(userId, setId);
        setWordsData(data);
    }

    useEffect(() => {
        getWordsData();
    }, [])

    const columns = [
        {
            title: 'Word',
            dataIndex: 'word',
            key: 'word',
        },
        {
            title: 'Transcription',
            dataIndex: 'transcription',
            key: 'transcription',
            render: (wordData) => `[${wordData}]`
        },
        {
            title: 'Meaning',
            dataIndex: 'meaning',
            key: 'meaning',
        },
        {
            title: 'Trainings',
            key: 'tags',
            width: 150,
            render: wordData => {
                const getColor = (value) => value ? 'green' : 'volcano';
                return (
                    <span>
                    <Tag color={getColor(wordData.trainingEnRu)} key={0}>
                        {`${setLocale} -> RU`}
                    </Tag>
                    <Tag color={getColor(wordData.trainingRuEn)} key={1}>
                        {`RU -> ${setLocale}`}
                    </Tag>
                </span>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            render: (wordData) => (
                <Space size="middle">
                    <Tooltip placement="bottom" title="Edit word">
                        <Button icon={<EditOutlined />} onClick={ (e) => {
                            e.stopPropagation();
                            handleEditWord(wordData);
                        } } />
                    </Tooltip>
                    <Tooltip placement="bottom" title="Delete word">
                        <Popconfirm
                            title="Do you want to delete this word?"
                            onConfirm={() => handleDeleteWord(wordData.id)}
                            okText = "Yes"
                        >
                            <Button icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];


    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOpenTrainingsPage = () => {
        setIsModalVisible(false);
        navigate('/words/trainings', { state: { wordsData, set: { setId, setTitle, setLocale } }} );
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleEditWord = ({ id, word, transcription, meaning}) => {
        let inputWordValue = '';
        let inputTranscriptionValue = '';
        let inputMeaningValue = '';

        const handleChangeWord = (e) => {
            inputWordValue = e.target.value;
        }

        const handleChangeTranscription = (e) => {
            inputTranscriptionValue = e.target.value;
        }

        const handleChangeMeaning = (e) => {
            inputMeaningValue = e.target.value;
        }

        confirm({
            title: `Edit word "${word}"?`,
            keyboard: true,
            okText: 'Save',
            content: <div>
                <div>Word</div>
                <Input
                    placeholder={`${word}`}
                    allowClear={true}
                    onChange={handleChangeWord}
                />
                <div>Transcription</div>
                <Input
                    placeholder={`${transcription}`}
                    allowClear={true}
                    onChange={handleChangeTranscription}
                />
                <div>Meaning</div>
                <Input
                    placeholder={`${meaning}`}
                    allowClear={true}
                    onChange={handleChangeMeaning}
                />
            </div>,
            icon: <EditOutlined/>,
            onOk() {
                const userId = getLoggedUserId();

                const updatedWord = inputWordValue;
                const updatedTranscription = inputTranscriptionValue;
                const updatedMeaning = inputMeaningValue;

                if (!updatedWord && !updatedTranscription && !updatedMeaning) {
                    return;
                }

                return new Promise((resolve, reject) => {
                    const body = {
                        id: id,
                        word: updatedWord || word,
                        transcription: updatedTranscription || transcription,
                        meaning: updatedMeaning || meaning,
                    }
                    wordService.updateWord({ userId, setId, body })
                        .then(() => {
                            Logger.info(MODULE_NAME, 'handleEditWord', 'success');
                            setTimeout(resolve, 500)
                        })
                        .catch((error) => {
                            Logger.error(MODULE_NAME, 'showPromiseConfirmEdit', error);
                            setTimeout(reject, 500);
                        });
                })
                    .then(() => getWordsData());
            },
            onCancel() {},
        })
    }

    const handleDeleteWord = (wordId) => {
        const userId = getLoggedUserId();
        return new Promise((resolve, reject) => {
            wordService.deleteWord({ userId, setId, wordId })
                .then(() => {
                    Logger.info(MODULE_NAME, 'handleDeleteWord', 'success');
                    setTimeout(() => resolve(), 500)
                })
                .catch((error) => {
                    Logger.error(MODULE_NAME, 'handleDeleteWord', error);
                    reject();
                })
        })
            .then(() => getWordsData() )
    }

    const handleResetAllProgress = () => {
        const userId = getLoggedUserId();
        return new Promise((resolve, reject) => {
            wordService.resetWordsProgress({ userId, setId })
                .then(() => {
                    Logger.info(MODULE_NAME, 'handleResetAllProgress', 'success');
                    setTimeout(() => resolve(), 500)
                })
                .catch((error) => {
                    Logger.error(MODULE_NAME, 'handleResetAllProgress', error);
                    reject();
                })
        })
            .then(() => getWordsData() )
    }

    const title = () => `Words Page for set "${setTitle}"`;

    const stateTable = {
        bordered: true,
        size: 'small',
        pagination: false,
        title,
        scroll: { y: '60vh' },
        hasData: true,
        tableLayout: undefined,
        top: 'none',
        bottom: 'bottomRight',
    }

    const cardWordStyles= {
        fontSize: 25,
        fontWeight: 600,
        letterSpacing: 5,
    }

    const findCurrentWordIndex = (cardId) => {
        return wordsData.findIndex(wordData => wordData.id === cardId);
    }

    const setCardData = (wordData) => {
        setCardWord(wordData.word);
        setCardTranscription(wordData.transcription);
        setCardMeaning(wordData.meaning);
        setCardId(wordData.id);
    }

    const showCard = (wordData) => {
        setCardData(wordData);
        speak({ text: wordData.word, voice });
    }

    const prevWord = () => {
        const prevWordIndex = findCurrentWordIndex(cardId) - 1;
        showCard(wordsData[prevWordIndex] || wordsData[wordsData.length - 1]);
    }

    const nextWord = () => {
        const nextWordIndex = findCurrentWordIndex(cardId) + 1;
        showCard(wordsData[nextWordIndex] || wordsData[0]);
    }

    const shouldDisableGoToTrainingBtn = !isThereWordsToLearnInSet(wordsData);

    const keyHandling = (e) => {
        if (isModalVisible) {
            switch (e.keyCode) {
                // arrowRight
                case 39:
                    nextWord();
                    break;
                // arrowLeft
                case 37:
                    prevWord();
                    break;
                default:
                    break;
            }
        }
    }

    return (
        <div className="site-layout-background" style={ styleContainer } onKeyDown={keyHandling}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%"}}>
                <ButtonModalAddWords setId={setId} updateWordsPage={getWordsData}/>
                <Popconfirm
                    title="Do you want to reset all progress for this set?"
                    onConfirm={handleResetAllProgress}
                    okText = "Yes"
                >
                    <Button danger onClick={() => console.log('reset all progress')}>Reset all trainings</Button>
                </Popconfirm>
                <Tooltip placement="bottom" color={"blue"} title={shouldDisableGoToTrainingBtn ? YOU_LEARNED_ALL_WORDS_FROM_THIS_SET : ''}>
                    <Button type={"primary"} onClick={handleOpenTrainingsPage} disabled={shouldDisableGoToTrainingBtn} >Go to the trainings</Button>
                </Tooltip>
            </div>
            <Table
                onRow={(record) => ({
                    onClick: event => {
                        if (event.target.nodeName === "TD") {
                            showCard(record);
                            showModal();
                        }
                    }
                })}
                {...stateTable}
                style={{ width: '100%', height: '100%'}}
                columns={columns}
                dataSource={wordsData} />
            <Modal
                visible={isModalVisible}
                onOk={handleOpenTrainingsPage}
                onCancel={handleCancel}
                centered
                bodyStyle={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
                width={700}
                footer={[
                    <Space>
                        <Button key="cancel" onClick={handleCancel}>
                            Close
                        </Button>
                        <Tooltip placement="top" color={"blue"} title={shouldDisableGoToTrainingBtn ? YOU_LEARNED_ALL_WORDS_FROM_THIS_SET : ''}>
                            <Button type="primary" key="goToTheTraining" onClick={handleOpenTrainingsPage} disabled={shouldDisableGoToTrainingBtn}>
                                Go to the trainings
                            </Button>
                        </Tooltip>
                    </Space>
                ]}
            >
                <Button type="text" icon={<LeftOutlined />} onClick={prevWord}/>
                <Card
                    style= {{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
                    cover={
                        <div   style={{ width: 400, height: 400, overflow: "hidden" }}>
                            <img
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                alt="example"
                                src={getImgURL(cardMeaning)}
                            />
                        </div>
                    }
                >
                    <div style={ cardWordStyles }>{`${cardWord}`}</div>
                    <Button type="text"
                            onClick={ () => speak({ text: cardWord, voice }) }
                            size="large">
                        {`[ ${cardTranscription} ]`}
                    </Button>
                    <div style={ cardWordStyles }>{`${cardMeaning}`}</div>
                </Card>
                <Button  type="text" icon={<RightOutlined />} onClick={nextWord}/>
            </Modal>
        </div>
    )
}

const WordsPageWithRouter = withRouter(WordsPage);

export {
    WordsPageWithRouter,
}
