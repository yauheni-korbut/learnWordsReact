import { Button, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

//Components
import { SetCardWithRouter } from "../setCard/setCard";

//helpers
import { Logger } from "../../../utils/logger";
import { getCreateOrEditSetModal } from "../../../utils/Helpers";

//constants
import { LOCALE_EN } from "../../../utils/constants";

const { confirm } = Modal;

const MODULE_NAME = 'SetsPage';

const SetsPage = ({ setsState, updateSetsState, createNewSet }) => {
    const { setsData } = setsState;

    const handleCreateNewSet = () => {
        onCreateNewSet()
            .then(() => updateSetsState())
            .catch((error) => {
                if (error.reason === 'user') {
                    Logger.info(MODULE_NAME, 'handleCreateNewSet', error.message);
                } else {
                    Logger.error(MODULE_NAME, 'handleCreateNewSet', error);
                }
            })
    };

    const onCreateNewSet = () => {
        return new Promise((resolve, reject) => {
            Logger.info(MODULE_NAME, 'onCreateNewSet', 'open modal to create new set');

            const props = {
                setNameInputTittle: 'Set name:',
                setNameInputPlaceholder: 'Please, write set name',
                localeInputTitle: 'Locale:',
                defaultLocaleValue: LOCALE_EN,
            }

            const setCreationModalModel = getCreateOrEditSetModal(props);

            confirm({
                title: 'Write name of new set and choose a locale',
                keyboard: true,
                okText: 'Create set',
                content: setCreationModalModel.content,
                icon: <EditOutlined />,
                onOk() {
                    const title = setCreationModalModel.inputSetNameValue || 'Untitled set';
                    const locale = setCreationModalModel.localeValue || LOCALE_EN;
                    createNewSet({ title, locale })
                        .then(() => resolve())
                        .catch(reject)
                },
                onCancel() { reject({ reason: 'user', message: 'Modal was closed by user'}) },
            });
        })
    };

    const styles = {
        padding: 24,
        minHeight: '81vh',
        marginTop: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const cardsContainerStyles = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    };

    const setsCards = setsData
        ? setsData.map(set => (<SetCardWithRouter key={uuidv4()} set={set} updateSetsData={updateSetsState} />))
        : <></>;

    return (
        <div className="site-layout-background" style={styles}>
            <Button type="primary" style={{ marginBottom: 15 }} onClick={handleCreateNewSet}>Create new set</Button>
            <div style={cardsContainerStyles}>
                { setsCards }
            </div>
        </div>
    )
}

export {
    SetsPage,
}
