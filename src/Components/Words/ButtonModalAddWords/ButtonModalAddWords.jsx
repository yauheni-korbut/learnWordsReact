import { Modal, Button, Input, Form } from 'antd';
import { useState } from "react";

//services
import { wordService } from "../../../services/wordService";

//constants
import { currentUserKey } from "../../../services/serviceConstants";

const { TextArea } = Input;
const REG_EXP_TO_SPLIT_ADDED_WORDS = /[\[\]]/g; // split by [ ]

const ButtonModalAddWords = ({ setId, updateWordsPage }) => {
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [newWords, setNewWords] = useState('');

    const onChangeInputNewWords = (e) => {
        setNewWords(e.target.value);
    }

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        const userId = JSON.parse(localStorage.getItem(currentUserKey)).id;
        setConfirmLoading(true);
        const newWordsData = getParsedNewWords();
        wordService.createWord({ userId, setId, body: newWordsData })
            .then(() => {
                setVisible(false);
                setConfirmLoading(false);
                setNewWords('');
                updateWordsPage();
            })
    };

    const wordDataToObj = ([ word, transcription, meaning ]) => {
        return { word, transcription, meaning }
    }

    const getParsedNewWords = () => {
        return newWords.trim().split('\n')
            .map(wordData => {
                const wordDataArray =  wordData.split(REG_EXP_TO_SPLIT_ADDED_WORDS).map(item => item.trim());
                return wordDataToObj(wordDataArray);
            });
    }

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <>
            <Button type="primary" style={{ marginBottom: 15 }} onClick={ showModal }>Add words to this set</Button>
            <Modal
                title="Write new words"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>Example:</p>
                <div> abandon [əˈbændən] оставить</div>
                <div>accept [əkˈsept] принимать</div>
                <Form.Item>
                    <TextArea style={{ marginTop: 20 }} rows={10} onChange={onChangeInputNewWords} value={newWords}/>
                </Form.Item>
            </Modal>
        </>
    );
};

export {
    ButtonModalAddWords,
}
