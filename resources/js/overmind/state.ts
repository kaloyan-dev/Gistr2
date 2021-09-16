import { Gist, Folder, Settings } from '../helpers/interfaces';

type State = {
    addFolder: boolean;
    editFolder: number;
    folder: number;
    folders: Folder[];
    settings: Settings;
    loaded: boolean;
    maxPage: number;
    viewPage: number;
    filter: string;
    filterFocus: boolean;
    selected: string[];
    lastSelected: string;
    gists: {
        source: Gist[],
        filtered: Gist[],
    }
}

export const state: State = {
    addFolder: false,
    editFolder: 0,
    folder: 0,
    folders: [
        {
            id: 1,
            title: 'Favorites',
            color: 'green',
            gists: []
        },
    ],
    settings: {
        'inverted_colors': false,
        'compact_mode': false,
        'hide_user_info': false,
        'pagination_top': false,
        'sidebar_right': false,
        'highlight_folders': true,
        'folder_labels': true,
        'use_cache': true,
        'hide_gdpr': false,
        'per_page': 15,
    },
    loaded: false,
    maxPage: 1,
    viewPage: 1,
    filter: '',
    filterFocus: false,
    selected: [],
    lastSelected: '',
    gists: {
        source: [],
        filtered: [],
    },
};
