import { Card, Avatar, Modal, Checkbox } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, ReadOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { currentUserKey } from "../../../services/serviceConstants";
import { setService } from "../../../services/setService";
import { Logger } from "../../../utils/logger";
import {getCreateOrEditSetModal} from "../../../utils/Helpers";

const MODULE_NAME = 'setCard';

const { confirm } = Modal;
const { Meta } = Card;

const withRouter = WrappedComponent => props => {
    const location = useLocation();

    return <WrappedComponent {...props} location={location} />;
};

const SetCard = ({ set, updateSetsData, onSelectChange, isSelected }) => {
    const { name: title, id, locale } = set;

    const styles = {
        width: 300,
        margin: 10,
    };

    const navigate = useNavigate();

    const handleCardClick = () => {
        Logger.info(MODULE_NAME, 'handleCardClick', 'chosen set: ', { title, id });
        navigate('/set/words', { state: { set: { title, id, locale } }} );
    }

    function showPromiseConfirmDelete(setTitle, setId) {
        confirm({
            title: `Do you want to delete set "${setTitle}"?`,
            icon: <ExclamationCircleOutlined />,
            keyboard: true,
            onOk() {
                const userId = JSON.parse(localStorage.getItem(currentUserKey)).id;
                return new Promise((resolve, reject) => {
                    setService.deleteSet(userId, setId)
                        .then(() => {
                            Logger.info(MODULE_NAME, 'showPromiseConfirmDelete', 'success');
                            setTimeout(resolve, 500)
                        })
                        .catch((error) => {
                            Logger.error(MODULE_NAME, 'showPromiseConfirmDelete', error);
                            setTimeout(reject, 500);
                        });
                })
                    .then(() => updateSetsData());
            },
            onCancel() {},
        });
    }

    const handleCardDelete = (e) => {
        e.stopPropagation();
        showPromiseConfirmDelete(title, id)
    }

    function showPromiseConfirmEdit(setTitle, setId) {

        const props = {
            setNameInputTittle: 'New set name:',
            setNameInputPlaceholder: 'Please, write new set name',
            localeInputTitle: 'Locale:',
            defaultLocaleValue: locale,
        }

        const setEditionModalModel = getCreateOrEditSetModal(props);

        confirm({
            title: `Write new name for set "${setTitle}"?`,
            keyboard: true,
            okText: 'Update set',
            content: setEditionModalModel.content,
            icon: <EditOutlined />,
            onOk() {
                const userId = JSON.parse(localStorage.getItem(currentUserKey)).id;
                const newSetTitle = setEditionModalModel.inputSetNameValue;
                const newSetLocale = setEditionModalModel.localeValue;
                if(!newSetTitle && !newSetLocale) {
                    return;
                }
                return new Promise((resolve, reject) => {
                    setService.updateSet({ title: newSetTitle, locale: newSetLocale }, userId, setId)
                        .then(() => {
                            Logger.info(MODULE_NAME, 'showPromiseConfirmEdit', 'success');
                            setTimeout(resolve, 500)
                        })
                        .catch((error) => {
                            Logger.error(MODULE_NAME, 'showPromiseConfirmEdit', error);
                            setTimeout(reject, 500);
                        });
                })
                    .then(() => updateSetsData());
            },
            onCancel() {},
        });
    }

    const handleCardEdit = (e) => {
        e.stopPropagation();
        showPromiseConfirmEdit(title, id)
    }

    return (
        <Card
            className="set-card"
            key={id}
            style={styles}
            cover={
                <div className="set-card-cover">
                    <span className="set-card-cover-label">VOCABULARY SET</span>
                    <ReadOutlined />
                    <span className="set-card-cover-locale">{locale}</span>
                </div>
            }
            actions={[
                <EditOutlined id="edit" onClick={handleCardEdit} />,
                <DeleteOutlined id="delete" onClick={handleCardDelete} />,
                <Checkbox
                    checked={isSelected}
                    onChange={() => onSelectChange(id)}
                    onClick={(e) => e.stopPropagation()}
                >
                    Select
                </Checkbox>,
            ]}
            hoverable
            onClick={handleCardClick}
        >
            <Meta
                key={id}
                avatar={<Avatar className="set-card-avatar" icon={<ReadOutlined />} />}
                title={`${title} (${locale})`}
            />
        </Card>
    )
};

const SetCardWithRouter = withRouter(SetCard);

export {
    SetCardWithRouter,
}
