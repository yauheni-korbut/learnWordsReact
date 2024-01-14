import { Layout, Menu} from "antd";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

const { Header } = Layout;
const menuItems = ['Home', 'Sets'];

const MODULE_NAME = 'AppHeader';

const menuItemsComponents = menuItems.map((item) => {
    return (
        <Menu.Item key={uuidv4()}>
            <Link to={`/${item.toLowerCase()}` }/>
            <span>{ item }</span>
        </Menu.Item>
    );
});

const AppHeader = () => {
    return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                { menuItemsComponents }
            </Menu>
        </Header>
    )
}

export {
    AppHeader,
}
