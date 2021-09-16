import React, { FC, useState } from 'react';
import { useAppState, useActions } from '../overmind';

import GistEmbed from 'react-gist';
import Icon from './Icon';
import Loading from './Loading';

import { Gist } from '../helpers/interfaces';
import { username } from '../helpers/userdata';
import { getColorMap, save } from '../helpers/utils';

const GistList: FC = () => {
    const state   = useAppState();
    const { gists, settings, viewPage } = useAppState();
    const actions = useActions();
    const baseURL = 'https://gist.github.com';

    const [open, setOpen] = useState<string[]>([]);
    const [copied, setCopied] = useState<boolean>(false);

    const toggleOpen = (id: string) => {
        let editOpen = [...open];

        if (! editOpen.includes(id)) {
            editOpen.push(id);
            setOpen(editOpen);
            return;
        }

        editOpen = editOpen.filter(item => {
            return item !== id;
        });

        setOpen(editOpen);
    };

    const getGistURL = (gist: Gist, param: string = '') => {
        return `${baseURL}/${username}/${gist.id}${param}`;
    };

    const copyToClipboard = (url: string) => {
        const $clipboard = document.createElement('textarea');
        $clipboard.value = url;
        $clipboard.style.position = 'fixed';
        document.body.appendChild($clipboard);
        $clipboard.focus();
        $clipboard.select();
        document.execCommand('copy');
        document.body.removeChild($clipboard);
        setCopied(true);
    }

    const gistTitle = (gist: Gist) => {
        return (
            <span className="flex items-center">
                {gist.name}
                {
                    state.settings.folder_labels && state.folders.map((folder, index) => {
                        if (folder.gists.includes(gist.id)) {
                            const colorMap = getColorMap();
                            const bgColor  = colorMap[folder.color][1];

                            return (
                                <span key={index} className={`${bgColor} ml-2 text-white leading-none py-1 px-2 rounded-md text-xs`}>{folder.title}</span>
                            );
                        }
                    })
                }
            </span>
        );
    }

    const handleSelected = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
        actions.toggleSelected({
            id,
            event
        });
    };

    const toggleFavorite = (id: string) => {
        actions.toggleFavorite(id);
        save(state);
    }

    return (
        <div className="shadow mt-4 w-full">
            <ul>
                {
                    gists.filtered.map((gist, id) => {
                        if (gist.page !== viewPage) {
                            return;
                        }

                        const titleColor = open.includes(gist.id) ? 'text-blue-500' : 'text-gray-600';
                        const bgColor    = state.selected.includes(gist.id) ? 'bg-yellow-50' : 'bg-white';
                        const itemStyle  = open.includes(gist.id) ? 'h-auto' : 'h-0';
                        const padding    = settings.compact_mode ? 'p-2 pl-0' : 'p-4 pl-2';
                        const width      = settings.compact_mode ? 'w-[40px]' : 'w-[50px]';
                        const isFavorite = state.folders[0].gists.includes(gist.id);
                        const starIcon   = isFavorite ? 'star-filled' : 'star';
                        const classes    = isFavorite ? 'w-6 h-6 text-green-500' : 'w-6 h-6';

                        return (
                            <li className={`${bgColor} first:mt-0 cursor-pointer border-b last:border-b-0 select-none`} key={id}>
                                <div className="relative pl-[40px]">
                                    <div className={`${width} h-full absolute top-0 left-0 transition-all`} onClick={(event) => {handleSelected(event, gist.id)}}>
                                        <Loading />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20px] h-[20px] border border-gray-500">
                                            {
                                                state.selected.includes(gist.id) && (
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20px] h-[20px]">
                                                        <Icon type="check" classes="w-[20px] h-[20px]" />
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className={`${padding} flex items-center w-full transition-all`} onClick={() => toggleOpen(gist.id)}>
                                            <h2 className={titleColor}>{gistTitle(gist)}</h2>
                                        </div>
                                        <div className={`${padding} flex text-gray-400 transition-all cursor-default`}>
                                            <a href={getGistURL(gist)} target="_blank" className="hover:text-gray-700">
                                                <Icon type="eye" tooltip="View on GitHub" classes="w-6 h-6" />
                                            </a>
                                            <a href={getGistURL(gist, '/edit')} target="_blank" className="ml-3 hover:text-gray-700">
                                                <Icon type="pencil" tooltip="Edit on GitHub" classes="w-6 h-6" />
                                            </a>
                                            <span className="ml-3 hover:text-gray-700" onClick={() => copyToClipboard(getGistURL(gist))} onMouseEnter={() => setCopied(false)}>
                                                <Icon type="clipboard" tooltip={copied ? 'Copied !' : 'Copy URL to Clipboard'} classes="w-6 h-6" />
                                            </span>
                                            <span className="ml-3 hover:text-green-500" onClick={() => toggleFavorite(gist.id)}>
                                                <Icon type={starIcon} tooltip={isFavorite ? 'Unfavorite' : 'Favorite'} classes={classes} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`overflow-hidden ${itemStyle}`}>
                                    {open.includes(gist.id) && <GistEmbed key={id} id={gist.id} />}
                                </div>
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}

export default GistList;
