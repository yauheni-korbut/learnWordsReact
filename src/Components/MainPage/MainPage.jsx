//Components
import { LoginForm } from "../LoginForm/LoginForm";
import { HelloPage } from "../HelloPage/HelloPage";

//Styles
import './MainPage.scss';

const MainPage = ({ userState, loginUser, logoutUser }) => {
    const { login } = userState;

    return (
        <div className="site-layout-background main-page-panel">
            {
                login
                    ? (<HelloPage userName={login} logoutUser={logoutUser}/>)
                    : (
                        <div className="welcome-content">
                            <span className="eyebrow">A LITTLE PRACTICE, EVERY DAY</span>
                            <h1>Make every word stick.</h1>
                            <p>Sign in with your username to continue learning.</p>
                            <LoginForm loginUser={loginUser} />
                        </div>
                    )
            }
        </div>
    )
}

export {
    MainPage,
}
