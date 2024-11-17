import { Input, Select, Space } from "antd";

// Constants
import { LOCALE_EN, LOCALE_PL } from "./constants";
import { currentUserKey } from "../services/serviceConstants";

const { Option } = Select;

const GREEN_LIGHT = '#52c41a7a';
const RED_LIGHT = '#ff00007a';
const TRANSPARENT = 'transparent';

const isRuEnTraining = (key) => key === 'trainingRuEn';

const isEnLocale = (locale) => locale === 'EN';

const getShuffleWords = (wordsData) => {
    return wordsData
        .map(wordData => ({ ...wordData, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ sort, ...wordData }) => wordData);
}

const getImgURL = (currentWordMeaning = 'question') => {
    return `https://tse3.mm.bing.net/th?q=${currentWordMeaning}&amp;w=42&amp;h=42&amp;c=1&amp;p=0&amp;pid=InlineBlock&amp;mkt=pl-PL&amp;cc=PL&amp;setlang=pl&amp;adlt=strict&amp;t=1`;
}

const getUserFromLocalStorage = () => {
    const loggedUser = JSON.parse(localStorage.getItem(currentUserKey));
    return loggedUser || null;
}

const getLoggedUserId = () => {
    return getUserFromLocalStorage().id;
}

const getCreateOrEditSetModal = (props) => {
    const { setNameInputTittle, setNameInputPlaceholder,localeInputTitle = 'Locale', defaultLocaleValue } = props;
    const modalModel = {};

    const handleSetNameInputChange = (e) => {
        modalModel.inputSetNameValue = e.target.value;
    }

    const handleLocaleChange = (value) => {
        modalModel.localeValue = value;
    }

    modalModel.content = (<Space direction="vertical" style={{ width: '100%' }}>
        { setNameInputTittle }
        <Input placeholder={setNameInputPlaceholder} allowClear={true} onChange={handleSetNameInputChange} />
        { localeInputTitle }
        <Select defaultValue={defaultLocaleValue} onChange={handleLocaleChange}>
            <Option value={LOCALE_EN}>{LOCALE_EN}</Option>
            <Option value={LOCALE_PL}>{LOCALE_PL}</Option>
        </Select>
    </Space>)

    return modalModel;
}

const isThereWordsToLearnInTraining = (wordsData = [], trainingKey) => {
    if (wordsData) {
        return wordsData.some((wordData) => !wordData[trainingKey]);
    }
    return false;
}

const isThereWordsToLearnInSet = (wordsData) => {
    return isThereWordsToLearnInTraining(wordsData,'trainingRuEn') || isThereWordsToLearnInTraining(wordsData,'trainingEnRu');
}

const getAnswerBtnBackgroundColor = (isAnswerChosen, isThisBtnWasChosen, isThisBtnChosenAsCorrectAnswer, isThisBtnShouldBeCorrectAnswer ) => {
    if (isAnswerChosen && isThisBtnWasChosen) {
        if (isThisBtnChosenAsCorrectAnswer) {
            return GREEN_LIGHT;
        } else {
            return RED_LIGHT;
        }
    } else if (isAnswerChosen && isThisBtnShouldBeCorrectAnswer) {
        return GREEN_LIGHT;
    } else {
        return TRANSPARENT;
    }
}

const getTitleForCard = (trainingKey, currentWord) => {
    const title = isRuEnTraining(trainingKey) ? currentWord.meaning : currentWord.word;
    return (
        <div style={{ fontSize: '25px' }}>
            {title}
        </div>
    );
};

export {
    isRuEnTraining,
    getShuffleWords,
    getImgURL,
    getUserFromLocalStorage,
    getLoggedUserId,
    getCreateOrEditSetModal,
    isThereWordsToLearnInTraining,
    isThereWordsToLearnInSet,
    isEnLocale,
    getAnswerBtnBackgroundColor,
    getTitleForCard,
}
