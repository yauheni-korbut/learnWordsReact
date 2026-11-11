import { Layout, Menu } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import { Link, useLocation } from 'react-router-dom';

const { Header } = Layout;
const menuItems = ['Home', 'Sets'];

const menuItemsComponents = menuItems.map(item => (
    {
        key: `/${item.toLowerCase()}`,
        label: <Link to={`/${item.toLowerCase()}` }>{item}</Link>,
    }
))

const AppHeader = () => {
    const location = useLocation();

    const getSelectedKey = (pathname) => pathname === '/' || pathname.startsWith('/home') ? '/home' : '/sets';

    const selectedKey = getSelectedKey(location.pathname);

    return (
        <Header className="app-header">
            <div className="app-header-inner">
                <Link className="app-brand" to="/home">
                    <span className="app-brand-mark"><ReadOutlined /></span>
                    <span>Wordwise</span>
                </Link>
                <Menu className="app-menu" mode="horizontal" selectedKeys={[selectedKey]} items={menuItemsComponents} />
            </div>
        </Header>
    )
}

export {
    AppHeader,
}
