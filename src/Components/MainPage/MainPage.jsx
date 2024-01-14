//Components
import { LoginForm } from "../LoginForm/LoginForm";
import { HelloPage } from "../HelloPage/HelloPage";

//Styles
import './MainPage.scss';

const MainPage = ({ userState, loginUser, logoutUser }) => {
    const { login } = userState;

    return (
        <div className="site-layout-background" style={{ padding: 24, minHeight: '82vh', marginTop: 16 }}>
            {
                login
                    ? (<HelloPage userName={login} logoutUser={logoutUser}/>)
                    : (<LoginForm loginUser={loginUser} />)
            }
        </div>
    )
}

export {
    MainPage,
}
