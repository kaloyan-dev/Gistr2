import { Context } from "../overmind";
import { Gist, ColorMap, Folder } from "./interfaces";

export const getColorMap = () => {
    const colorMap: ColorMap = {
        gray  : ['text-gray-500', 'bg-gray-500'],
        red   : ['text-red-500', 'bg-red-500'],
        yellow: ['text-yellow-500', 'bg-yellow-500'],
        green : ['text-green-500', 'bg-green-500'],
        blue  : ['text-blue-500', 'bg-blue-500'],
        indigo: ['text-indigo-500', 'bg-indigo-500'],
        purple: ['text-purple-500', 'bg-purple-500'],
        pink  : ['text-pink-500', 'bg-pink-500'],
    };

    return colorMap;
}

export const getSettingsMap = () => {
    const settingsMap = [
        {
            name: 'inverted_colors',
            label: 'Inverted Colors',
            type: 'toggle',
        },
        {
            name: 'compact_mode',
            label: 'Compact Mode',
            type: 'toggle',
        },
        {
            name: 'hide_user_info',
            label: 'Hide User Info',
            type: 'toggle',
        },
        {
            name: 'pagination_top',
            label: 'Pagination On Top',
            type: 'toggle',
        },
        {
            name: 'sidebar_right',
            label: 'Sidebar On The Right',
            type: 'toggle',
        },
        {
            name: 'highlight_folders',
            label: 'Highlight Folders',
            type: 'toggle',
        },
        {
            name: 'folder_labels',
            label: 'Folder Labels',
            type: 'toggle',
        },
        {
            name: 'use_cache',
            label: 'Use Cache',
            type: 'toggle',
        },
        {
            name: 'hide_gdpr',
            label: 'Hide GDPR Info',
            type: 'toggle',
        },
        {
            name: 'per_page',
            label: 'Gists Per Page',
            type: 'select',
            options: [5, 10, 15, 20, 25, 30, 40, 50]
        },
    ];

    return settingsMap
}

export const paginateGists = (per_page: number, state: Context['state'], actions: Context['actions']) => {
    let currentGists: Gist[] = [];
    let counter              = 1;
    let page                 = 1;
    let filteredGists        = [...state.gists.source];

    actions.setMaxPage(1);

    if (0 !== state.folder) {
        let filteredGistsByFolder = [...filteredGists];
        const currentFolder = state.folders.find((folderObject: Folder) => folderObject.id === state.folder);

        if (currentFolder) {
            filteredGists = filteredGistsByFolder.filter((gist) => {
                return currentFolder.gists.includes(gist.id);
            });
        }
    }

    if ('' !== state.filter) {
        let filteredGistsByName = [...filteredGists];

        filteredGists = filteredGistsByName.filter((gist) => {
            return gist.name.match( new RegExp( state.filter, 'gi' ) );
        });
    }

    filteredGists.forEach((gist) => {
        if (counter > per_page) {
            page++;
            counter = 1;

            actions.setMaxPage(page);
        }

        counter++;

        currentGists.push({
            id  : gist.id,
            name: gist.name,
            page,
        });
    });

    actions.setViewPage(1);
    actions.setFilteredGists(currentGists);
};

export const clearFoldersCache = (state: Context['state'], actions: Context['actions']) => {
    const gists              = state.gists.filtered.map((gist) => gist.id);
    const folders            = state.folders;
    const filtered: Folder[] = [];
    let saveNeeded = false;

    folders.map((folder) => {
        const filteredFolder = {...folder};

        filteredFolder.gists = filteredFolder.gists.filter((id) => gists.includes(id));

        filtered.push(filteredFolder);

        if (filteredFolder.gists.length !== folder.gists.length) {
            saveNeeded = true;
        }
    });

    if (saveNeeded) {
        actions.setFolders(filtered);
        save(state);
    }
}

export const saveCache = (state: Context['state']) => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    if (! token) {
        return;
    }

    const data = {
        cache: state.gists.source
    }

    const requestHeaders: HeadersInit = new Headers();

    requestHeaders.set('X-CSRF-TOKEN', token);
    requestHeaders.set('Content-Type', 'application/json');

    fetch('cache', {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(data)
    });
}

export const save = (state: Context['state']) => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    if (! token) {
        return;
    }

    const data = {
        userdata: {
            settings: state.settings,
            folders: state.folders,
        }
    }

    const requestHeaders: HeadersInit = new Headers();

    requestHeaders.set('X-CSRF-TOKEN', token);
    requestHeaders.set('Content-Type', 'application/json');

    fetch('userdata', {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(data)
    });
}

export const deleteUser = () => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    if (! token) {
        return;
    }

    const requestHeaders: HeadersInit = new Headers();

    requestHeaders.set('X-CSRF-TOKEN', token);

    fetch('userdata', {
        method: 'DELETE',
        headers: requestHeaders,
    }).then(() => {
        location.reload();
    });
}
