import { useLocation } from "react-router-dom";

//Components
import { TrainingCardWithRouter } from "../TrainingCard/TrainingCard";

const TrainingsPage = () => {
    const { state } = useLocation();
    const { wordsData, set: { setId, setTitle, setLocale } } = state;

    return (
        <div className="site-layout-background training-modes-page">
            <div className="training-page-heading">
                <span className="eyebrow">YOUR PRACTICE</span>
                <h1>Choose a training mode</h1>
                <p>Pick a direction to review words from <strong>{setTitle}</strong>.</p>
            </div>
            <div className="training-modes-grid">
                <TrainingCardWithRouter title={`RU -> ${setLocale}`} wordsData={wordsData} trainingKey={'trainingRuEn'} setId={setId} setTitle={setTitle} setLocale={setLocale} />
                <TrainingCardWithRouter title={`${setLocale} -> RU`} wordsData={wordsData} trainingKey={'trainingEnRu'} setId={setId} setTitle={setTitle} setLocale={setLocale} />
            </div>
        </div>
    )
}

export {
    TrainingsPage,
}
