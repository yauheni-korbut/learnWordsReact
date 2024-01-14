import { Form, Input, Button } from 'antd';

//helpers
import { Logger } from "../../utils/logger";

const MODULE_NAME = 'LoginForm';

const LoginForm = ({ loginUser }) => {

    const onFinish = async (values) => {
        const { username } = values;
        const user = await loginUser(username);
        Logger.info(MODULE_NAME, 'onFinish', JSON.stringify(user))
    };

    const onFinishFailed = (errorInfo) => {
        Logger.error(MODULE_NAME, 'onFinishFailed', JSON.stringify(errorInfo))
    };

    const formStyles = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    }

    return (
        <Form
            style={formStyles}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }} >
                <Button type="primary" htmlType="submit">
                    Log In
                </Button>
            </Form.Item>
        </Form>
    );
};

export {
    LoginForm,
}
