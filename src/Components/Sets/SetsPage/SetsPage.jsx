import { useState } from 'react';
import { Button, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";

// Components
import { SetCardWithRouter } from "../SetCard/SetCard";

// Helpers
import { Logger } from "../../../utils/logger";
import { getCreateOrEditSetModal } from "../../../utils/Helpers";

// Constants
import { LOCALE_EN } from "../../../utils/constants";

const { confirm } = Modal;

const styles = {
    padding: 24,
    minHeight: '81vh',
    marginTop: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 15,
};

const cardsContainerStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
};

const btnContainer = {
    display: 'flex',
    flexDirection: 'row',
    gap: 30,
}

const MODULE_NAME = 'SetsPage';

const SetsPage = ({ setsState, updateSetsState, createNewSet, mergeSets }) => {
    const [ selectedSetsIds, setSelectedSetsIds ] = useState([]);
    const { setsData } = setsState;

    const isMergeDisabled = !selectedSetsIds.length

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

    const handleMergeSets = () => {
        mergeSets(selectedSetsIds)
            .then(() => {
                updateSetsState();
                setSelectedSetsIds([]);
            })
            .catch((error) => {
                if (error.reason === 'user') {
                    Logger.info(MODULE_NAME, 'handleMergeSets', error.message);
                } else {
                    Logger.error(MODULE_NAME, 'handleMergeSets', error);
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

    const onSelectChange = (setId) => {
        const isAlreadySelected = selectedSetsIds.includes(setId);
        const updatedIds = isAlreadySelected ? selectedSetsIds.filter(id => id !== setId) : [...selectedSetsIds, setId];

        setSelectedSetsIds(updatedIds);
    };

    const setsCards = setsData
        ? setsData.map(set => (<SetCardWithRouter key={set.id} set={set} updateSetsData={updateSetsState} onSelectChange={onSelectChange} isSelected={selectedSetsIds.includes(set.id)} />))
        : <></>;

    return (
        <div className="site-layout-background" style={styles}>
            <div style={btnContainer}>
                <Button type="primary" style={{ minWidth: 170 }} onClick={handleCreateNewSet}>Create new set</Button>
                <Button disabled={isMergeDisabled} type="primary" style={{ minWidth: 170 }} onClick={handleMergeSets}>Merge selected sets</Button>
            </div>
            <div style={cardsContainerStyles}>
                { setsCards }
            </div>
        </div>
    )
}

export {
    SetsPage,
}
