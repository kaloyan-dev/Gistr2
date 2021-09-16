import React, { FC, useEffect, useState } from 'react';
import { useAppState, useActions } from '../overmind';

import Loading from './Loading';
import UserProfile from './UserProfile';
import Filter from './Filter';
import Folders from './Folders';
import SettingsList from './SettingsList';
import GDPR from './GDPR';
import GistList from './GistList';
import Icon from './Icon';
import Pagination from './Pagination';
import { paginateGists, saveCache } from '../helpers/utils';

const App: FC = () => {
    const [page, setPage] = useState<number>(1);

    const state = useAppState();
    const actions = useActions();

    useEffect(() => {
        document.onkeydown = (event) => {
            if ('Escape' === event.code) {
                actions.clearSelected();
                actions.setAddFolder(false);
                actions.setEditFolder(0);
            }

            if ('KeyA' === event.code && (event.ctrlKey || event.metaKey) && state.gists.filtered.length && ! state.filterFocus) {
                event.preventDefault();

                if (! state.loaded) {
                    return;
                }

                let selected        = [...state.selected];
                const gistsOnPage   = [...state.gists.filtered].filter((gist) => gist.page === state.viewPage);
                const gistsSelected = gistsOnPage.filter((gist) => state.selected.includes(gist.id));

                if (gistsOnPage.length === gistsSelected.length) {
                    selected = selected.filter((id) => ! gistsSelected.find((gist) => gist.id === id));
                    actions.setSelected(selected);
                    return;
                }

                gistsOnPage.map((gist) => {
                    if (! selected.includes(gist.id)) {
                        selected.push(gist.id);
                    }
                });

                actions.setSelected(selected);
            }
        }

        fetch('userdata')
            .then(response => {
                response.text()
                    .then(text => {
                        const data = text && text.length ? JSON.parse(text) : '';

                        if (data) {
                            actions.setSettings({...state.settings, ...data.settings});
                            actions.setFolders(data.folders);
                        }
                    })
                    .then(() => {
                        fetch('cache')
                            .then(response => {
                                response.text()
                                    .then(text => {
                                        const data = text && text.length ? JSON.parse(text) : '';

                                        if (state.settings.use_cache && data && 'number' === typeof state.settings.per_page) {
                                            actions.setSourceGists(data);
                                            actions.setFilteredGists(data);
                                            paginateGists(state.settings.per_page, state, actions);
                                            actions.setLoaded(true);
                                        } else {
                                            fetchGists(page);
                                        }
                                    })
                            })

                    })
            })
    }, []);

    const fetchGists = (page: number) => {
        fetch(`gists?page=${page}&per_page=${state.settings.per_page}`)
            .then(response => response.json())
            .then(data => {
                const currentGists = [...state.gists.source];

                actions.setSourceGists(currentGists.concat(data));
                if ('number' === typeof state.settings.per_page) {
                    paginateGists(state.settings.per_page, state, actions);
                }

                if (data.length < state.settings.per_page && 'number' === typeof state.settings.per_page) {
                    actions.setFilteredGists([...state.gists.source]);
                    paginateGists(state.settings.per_page, state, actions);
                    saveCache(state);
                    actions.setLoaded(true);
                    return;
                }

                if (state.settings.per_page === data.length) {
                    fetchGists(page + 1);
                    setPage(page + 1);
                }
            });
    }

    const resetFolder = () => {
        if (0 === state.folder) {
            return;
        }

        actions.setFolder(0);

        if ('number' === typeof state.settings.per_page) {
            paginateGists(state.settings.per_page, state, actions);
        }
    };

    const invertedClass = state.settings.inverted_colors ? 'dark': '';
    const boldClass     = 0 === state.folder ? 'font-bold' : '';
    const reverseClass  = state.settings.pagination_top ? 'flex-col-reverse' : '';
    const wrapperClass  = state.settings.sidebar_right ? 'md:pr-[260px]' : 'md:pl-[260px]';
    const sidebarClass  = state.settings.sidebar_right ? 'right-0' : 'left-0';

    return (
        <div className={`${invertedClass} bg-gray-100 h-full`}>
            { state.loaded && <GDPR />}
            <div className={`h-full ${wrapperClass}`}>
                <div className="p-4">
                    <div className={`w-[260px] bottom-0 bg-white p-6 shadow hidden md:block fixed top-0 ${sidebarClass}`}>
                        <UserProfile />

                        <div className="flex pt-6 text-sm leading-[24px] text-gray-900">
                            <Icon type="code" classes="w-6 h-6" />
                            <div className={`${boldClass} ml-2 w-full flex justify-between cursor-pointer`} onClick={() => resetFolder()}>
                                <p>All Gists</p>
                                <span className="text-xs leading-[24px]">{state.gists.source.length}</span>
                            </div>
                        </div>

                        <Folders />
                        <SettingsList />
                    </div>

                    <Filter />
                    <div className={`flex flex-wrap ${reverseClass}`}>
                        <GistList />
                        {
                            state.maxPage > 1 && (
                                <div className="relative mt-4 w-full">
                                    <Loading />
                                    <Pagination />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
