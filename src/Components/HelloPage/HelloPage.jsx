import { Button } from "antd";

const MODULE_NAME = 'HelloPage';

const HelloPage = ({ userName, logoutUser }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 30, marginBottom: 16 }}>
                {`Hello, ${userName}`}
            </div>
            <Button type="primary" onClick={logoutUser} >Log out</Button>
        </div>
    )
}

export {
    HelloPage,
}
