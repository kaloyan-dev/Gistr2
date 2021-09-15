import React, { FC } from 'react';
import { useAppState, useActions } from '../overmind';

import Icon from './Icon';
import Loading from './Loading';

import { getSettingsMap, paginateGists, save } from '../helpers/utils';

const SettingsList: FC = () => {
    const state = useAppState();
    const actions = useActions();

    const settingsMap = getSettingsMap();

    const updatePerPage = (per_page: number) => {
        actions.updateSettings({ per_page: per_page });

        if ('number' === typeof per_page) {
            paginateGists(per_page, state, actions);
        }

        save(state);
    };

    const toggleSetting = (setting: string) => {
        actions.toggleSetting(setting);
        save(state);
    }

    return (
        <div className="text-sm mt-10 relative">
            <Loading />
            <h2 className="flex justify-center leading-[24px]">
                <Icon type="cog" classes="w-6 h-6" />
                <span className="ml-2">Settings</span>
            </h2>
            <ul className="mt-4 py-2">
                {
                    settingsMap.map((setting, id) => {
                        const color = state.settings[setting.name] ? 'bg-blue-500': 'bg-gray-700';
                        const left  = state.settings[setting.name] ? 'left-[18px]': 'left-[2px]';

                        return (
                            <li key={id} className="flex justify-between mt-2 first:mt-0">
                                {setting.label}
                                {
                                    'toggle' === setting.type && (
                                        <div className={`${color} relative w-[32px] h-[16px] mt-[2px] rounded-xl cursor-pointer`} onClick={() => toggleSetting(setting.name)}>
                                            <span className={`${left} absolute top-[2px] w-[12px] h-[12px] bg-white rounded-full transition-all`}></span>
                                        </div>
                                    )
                                }
                                {
                                    'select' === setting.type && (
                                        <select className="bg-white cursor-pointer" onChange={(event) => updatePerPage(parseInt(event.target.value))} value={state.settings.per_page.toString()}>
                                            {
                                                setting.options?.map((option, id) => {
                                                    return (
                                                        <option key={id} value={option}>{option}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    )
                                }
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
};

export default SettingsList;
