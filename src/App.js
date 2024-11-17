import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from "antd";

import { AppHeader } from "./Components/Header/AppHeader";
import { MainPageContainer } from "./Components/MainPage/MainPageContainer";
import { SetsPageContainer } from "./Components/Sets/SetsPage/SetsPageContainer";
import { WordsPageWithRouter } from "./Components/Words/WordsPage/WordsPage";
import { TrainingsPage } from './Components/Trainings/TrainingsPage/TrainingsPage';
import { TrainingWordPage } from './Components/Trainings/TrainingWordPage/TrainingWordPage'
import './App.scss';

const { Content, Footer } = Layout;

function App() {
    const keyHandlerTrainingWordPage = (e) => {
        e.stopPropagation();
        console.log('keyHandlerTrainingWordPage ', e.keyCode)
        switch (e.keyCode) {
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
                document.getElementsByClassName('ant-card-grid')[e.keyCode - 49].click();
                break;
            case 13:
                document.getElementsByClassName('ant-btn-primary')[0].click();
                break;
            default:
                break;
        }
    }

    window.addEventListener("keydown", keyHandlerTrainingWordPage);

    return (
        <BrowserRouter>
            <Layout>
                <AppHeader />
                <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
                    <Routes>
                        <Route exact path='/' element = { <MainPageContainer /> }></Route>
                        <Route path='/home' element = { <MainPageContainer /> }></Route>
                        <Route path='/sets' element = { <SetsPageContainer /> }></Route>
                        <Route path='/set/words' element = { <WordsPageWithRouter /> }/>
                        <Route path='/words/trainings' element = { <TrainingsPage /> }></Route>
                        <Route path='/words/trainings/play' element = { <TrainingWordPage /> }></Route>
                    </Routes>
                </Content>
                <Footer style={{ textAlign: 'center' }}>App for learning words ©2024 Created by Yauheni Korbut & Iryna Ramanouskaya</Footer>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
