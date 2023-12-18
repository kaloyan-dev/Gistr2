import { Context } from './index';
import { Gist, Settings, Folder } from '../helpers/interfaces';

export const setSourceGists = ({ state }: Context, gists: Gist[]) => {
  state.gists.source = gists;
}

export const setFilteredGists = ({ state }: Context, gists: Gist[]) => {
  state.gists.filtered = gists;
}

export const setLoaded = ({ state }: Context, loaded: boolean) => {
  state.loaded = loaded;
}

export const setMaxPage = ({ state }: Context, page: number) => {
  state.maxPage = page;
}

export const setViewPage = ({ state }: Context, page: number) => {
  state.viewPage = page;
}

export const setSettings = ({ state }: Context, settings: Settings) => {
  state.settings = { ...settings };
}

export const updateSettings = ({ state }: Context, settings: Settings) => {
  state.settings = { ...state.settings, ...settings };
}

export const toggleSetting = ({ state }: Context, setting: string) => {
  const settings = { ...state.settings };

  settings[setting] = !settings[setting];

  state.settings = { ...state.settings, ...settings };
}

export const setSettingsOpen = ({ state }: Context, open: boolean) => {
  state.settingsOpen = open;
}

export const setAddFolder = ({ state }: Context, add: boolean) => {
  state.addFolder = add;
}

export const setEditFolder = ({ state }: Context, folder: number) => {
  state.editFolder = folder;
}

export const setFolder = ({ state }: Context, folder: number) => {
  state.folder = folder;
}

export const setFolders = ({ state }: Context, folders: Folder[]) => {
  state.folders = [...folders];
}

export const addOrRemoveFromFolder = ({ state }: Context, folderID: number) => {
  const folders = [...state.folders];
  const selectedFolder = folders.findIndex(folderObject => folderObject.id === folderID);
  const selected = [...state.selected];

  selected.map((id) => {
    if ('undefined' !== typeof selectedFolder) {
      if (folders[selectedFolder].gists.includes(id)) {
        const index = folders[selectedFolder].gists.indexOf(id);

        folders[selectedFolder].gists.splice(index, 1);
      } else {
        folders[selectedFolder].gists.push(id);
      }
    }
  });

  state.folders = [...folders];
}

export const toggleFavorite = ({ state }: Context, id: string) => {
  const favorites = [...state.folders[0].gists];

  if (favorites.includes(id)) {
    const index = favorites.indexOf(id);

    favorites.splice(index, 1);
  } else {
    favorites.push(id);
  }

  state.folders[0].gists = favorites;
}

export const setFilter = ({ state }: Context, filter: string) => {
  state.filter = filter;
}

export const setFilterFocus = ({ state }: Context, focus: boolean) => {
  state.filterFocus = focus;
}

export const clearSelected = ({ state }: Context) => {
  state.selected = [];
}

export const setSelected = ({ state }: Context, selected: string[]) => {
  state.selected = selected;
}

export const toggleSelected = ({ state }: Context, { id, event }: { id: string; event: React.MouseEvent<HTMLDivElement, MouseEvent> }) => {
  const shift = event.shiftKey;
  const selected = [...state.selected];

  if (selected.includes(id)) {
    const index = selected.indexOf(id);

    selected.splice(index, 1);
  } else {
    selected.push(id);
  }

  // Mass select / clear
  if (shift && selected.length) {
    const gists = [...state.gists.filtered];
    const gistKeys = gists.map(gist => gist.id);
    const action = selected.includes(id) ? 'select' : 'clear';
    const firstID = gistKeys[Math.min(gistKeys.indexOf(id), gistKeys.indexOf(state.lastSelected))];
    const lastID = gistKeys[Math.max(gistKeys.indexOf(id), gistKeys.indexOf(state.lastSelected))];

    let inRange = false;

    gists.some((gist) => {
      if (gist.id === firstID) {
        inRange = true;
        return;
      }

      if (!inRange) {
        return;
      }

      if (gist.id === lastID) {
        return true;
      }

      switch (action) {
        case 'select':
          if (!selected.includes(gist.id)) {
            selected.push(gist.id);
          }

          break;
        case 'clear':
          if (selected.includes(gist.id)) {
            const index = selected.indexOf(gist.id);

            selected.splice(index, 1);
          }

          break;
      }
    });
  }

  state.selected = selected;
  state.lastSelected = selected.length ? id : '';
}
