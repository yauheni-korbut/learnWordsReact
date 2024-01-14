import { useLocation } from "react-router-dom";

//Components
import { TrainingCardWithRouter } from "../TrainingCard/TrainingCard";

const TrainingsPage = () => {
    const { state } = useLocation();
    const { wordsData, set: { setId, setTitle, setLocale } } = state;

    return (
        <div
            className="site-layout-background" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 24, minHeight: '82vh', marginTop: 16 }}>
            <p style={{ marginBottom: 50, fontSize: 35 }}>{`Choose, witch training would you like to have with words from set "${setTitle}"`}</p>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                <TrainingCardWithRouter title={`RU -> ${setLocale}`} wordsData={wordsData} trainingKey={'trainingRuEn'} setId={setId} setTitle={setTitle} setLocale={setLocale} />
                <TrainingCardWithRouter title={`${setLocale} -> RU`} wordsData={wordsData} trainingKey={'trainingEnRu'} setId={setId} setTitle={setTitle} setLocale={setLocale} />
            </div>
        </div>
    )
}

export {
    TrainingsPage,
}
