import React, { FC, useState, useRef, useEffect } from 'react';
import { useAppState, useActions } from '../overmind';

import Icon from './Icon';

import { Folder } from '../helpers/interfaces';
import { getColorMap, toggleFolder, save } from '../helpers/utils';

const Folders: FC = () => {
    const state = useAppState();
    const actions = useActions();

    const folderName = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState('');
    const [colors, setColors] = useState('gray');
    const [folderDelete, setFolderDelete] = useState(false);
    const [folderEdit, setFolderEdit] = useState(false);
    const colorMap = getColorMap();

    useEffect(() => {
        if (! state.addFolder && 0 === state.editFolder) {
            return;
        }

        if (folderName.current) {
            folderName.current.focus();
        }
    }, [state.addFolder, state.editFolder]);

    const updateFolders = () => {
        if (folderName.current && '' === folderName.current.value.trim()) {
            folderName.current.focus();
            return;
        }

        if (folderName.current) {
            const folders = [...state.folders];

            if (state.addFolder) {
                let maxID = 2;

                folders.map((folder) => {
                    if (folder.id >= maxID) {
                        maxID = folder.id + 1;
                    }
                });

                folders.push(
                    {
                        id: maxID,
                        title: folderName.current.value.trim(),
                        color: colors,
                        gists: []
                    }
                );

                actions.setFolders(folders);

                actions.setAddFolder(false);
            }

            if (! [0, 1].includes(state.editFolder)) {
                const currentIndex  = folders.findIndex((folder) => folder.id === state.editFolder);
                const currentFolder = folders[currentIndex];

                const updatedFolder = {
                    id: currentFolder.id,
                    title: folderName.current.value.trim(),
                    color: colors,
                    gists: currentFolder.gists,
                }

                folders.splice(currentIndex, 1, updatedFolder);

                actions.setFolders(folders);
                actions.setEditFolder(0);
            }

            save(state);
        }
    };

    const editFolder = () => {
        actions.setEditFolder(state.folder);

        const folders       = [...state.folders];
        const currentIndex  = folders.findIndex((folder) => folder.id === state.editFolder);
        const currentFolder = folders[currentIndex];

        setTitle(currentFolder.title);
        setColors(currentFolder.color);
    };

    const deleteFolder = () => {
        const folders = [...state.folders];
        const current = folders.findIndex(folder => folder.id === state.folder);
        const title   = folders[current].title;

        if (! confirm(`Are you sure you want to delete [${title}] ?`)) {
            return;
        }

        folders.splice(current, 1);
        actions.setFolders(folders);
        save(state);
    };

    const handleFolder = (folder: Folder) => {
        actions.setAddFolder(false);
        actions.setEditFolder(0);

        // Add or remove Gist from folder
        if (0 !== state.selected.length) {
            actions.addOrRemoveFromFolder(folder.id);
            save(state);
            return;
        }

        // Toggle active folder
        toggleFolder(state, actions, folder.id);
    };

    const bgClass = 0 !== state.selected.length && state.settings.highlight_folders ? 'bg-yellow-50 ring-2 ring-yellow-200 -mx-2 px-2' : '';

    return (
        <div className="relative select-none">
            <ul className={`${bgClass} py-3 my-3 text-sm leading-[24px]`}>
                {
                    state.folders.map((folder, index) => {
                        const margin = 1 === folder.id ? 'mb-6' : 'mb-2';
                        const active = folder.id === state.folder ? 'font-bold' : '';
                        const folderColor = colorMap[folder.color][0];

                        let icon = 1 === folder.id ? 'star' : 'folder';

                        if (state.folder === folder.id) {
                            const isFavorites = 1 === folder.id;
                            icon = isFavorites ? 'star-filled' : 'folder-open';

                            if (! isFavorites && folderDelete) {
                                icon = 'folder-remove';
                            }

                            if (! isFavorites && folderEdit) {
                                icon = 'pencil';
                            }
                        }

                        if (0 !== state.selected.length) {
                            icon = 'folder-add';
                        }

                        if (folder.id === state.editFolder) {
                            icon = 'pencil';
                        }

                        return (
                            <li className={margin} key={index} onClick={() => handleFolder(folder)}>
                                <div className={`${folderColor} flex cursor-pointer`}>
                                    <Icon type={icon} classes="w-6 h-6" />
                                    <span className={`${active} mx-2 justify-between whitespace-nowrap w-full overflow-hidden overflow-ellipsis`}>
                                        {folder.title}
                                    </span>
                                    <span className="text-xs leading-[24px]">{folder.gists.length}</span>
                                </div>
                            </li>
                        );
                    })
                }
            </ul>

            <div className="text-left text-sm leading-[24px]">
                {
                    (state.addFolder || ! [0, 1].includes(state.editFolder)) && (
                        <div>
                            <div className="flex">
                                <input type="text" className="border text-gray-700 border-gray-700 px-2 w-full focus:outline-none" ref={folderName} defaultValue={title} />
                                <button className="text-white bg-gray-700 px-4 focus:outline-none" onClick={updateFolders}>
                                    <Icon type="check" classes="w-5 h-5" />
                                </button>
                            </div>

                            <ul className="flex justify-between mt-4">
                                {
                                    Object.keys(colorMap).map((color, index) => {
                                        const colorClasses = colorMap[color][1];
                                        const classes      = colors === color ? `${colorClasses} ring-2 ring-gray-700` : colorClasses;

                                        return (
                                            <li key={index} className={`${classes} cursor-pointer w-5 h-5`} onClick={() => setColors(color)}></li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    )
                }

                <div className="flex justify-between text-xs">
                    {
                        (! state.addFolder && [0, 1].includes(state.folder)) && (
                            <span className="text-gray-500 rounded-full flex items-center cursor-pointer" onClick={() => actions.setAddFolder(true)}>
                                <Icon type="plus" classes="w-6 h-6" />
                                <span className="ml-1">Add Folder</span>
                            </span>
                        )
                    }

                    {
                        (! [0, 1].includes(state.folder) && [0, 1].includes(state.editFolder)) && (
                            <>
                                <span className="text-gray-500 rounded-full flex items-center cursor-pointer" onClick={editFolder} onMouseEnter={() => setFolderEdit(true)} onMouseLeave={() => setFolderEdit(false)}>
                                    <Icon type="edit" classes="w-6 h-6" />
                                    <span className="ml-1">Edit Folder</span>
                                </span>

                                <span className="text-gray-500 rounded-full flex items-center cursor-pointer" onClick={() => deleteFolder()}>
                                    <Icon type="minus" classes="w-6 h-6" />
                                    <span className="ml-1" onMouseEnter={() => setFolderDelete(true)} onMouseLeave={() => setFolderDelete(false)}>Delete Folder</span>
                                </span>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Folders;
