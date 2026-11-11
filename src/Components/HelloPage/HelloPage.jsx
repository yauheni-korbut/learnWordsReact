import { Button } from "antd";

const HelloPage = ({ userName, logoutUser }) => {
    return (
        <div className="hello-page" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>{`Hello, ${userName}`}</h1>
            <p>Ready to keep your vocabulary growing?</p>
            <Button type="primary" onClick={logoutUser} >Log out</Button>
        </div>
    )
}

export {
    HelloPage,
}
