import { Layout, Menu} from "antd";
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

    const getSelectedKey = (pathname) => pathname.startsWith('/home') ? '/home' : '/sets';

    const selectedKey = getSelectedKey(location.pathname);

    return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey]} items={menuItemsComponents} />
        </Header>
    )
}

export {
    AppHeader,
}
