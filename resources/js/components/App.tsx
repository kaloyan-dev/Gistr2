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
import {
  paginateGists,
  toggleFolder,
  clearFoldersCache,
  saveCache,
  save,
  getFolderID,
} from '../helpers/utils';

const App: FC = () => {
  const [page, setPage] = useState<number>(1);

  const state = useAppState();
  const actions = useActions();

  useEffect(() => {
    document.onkeydown = (event) => {
      if ('Escape' === event.code) {
        if (state.filterFocus) {
          actions.setFilter('');

          const $filter = document.getElementById('filter') as HTMLInputElement;
          $filter.value = '';

          if ('number' === typeof state.settings.per_page) {
            paginateGists(state.settings.per_page, state, actions);
          }
        } else {
          actions.clearSelected();
          actions.setAddFolder(false);
          actions.setEditFolder(0);
        }
      }

      if (
        'KeyA' === event.code &&
        (event.ctrlKey || event.metaKey) &&
        state.gists.filtered.length &&
        !state.filterFocus
      ) {
        event.preventDefault();

        if (!state.loaded) {
          return;
        }

        let selected = [...state.selected];
        const gistsOnPage = [...state.gists.filtered].filter(
          (gist) => gist.page === state.viewPage
        );
        const gistsSelected = gistsOnPage.filter((gist) =>
          state.selected.includes(gist.id)
        );

        if (gistsOnPage.length === gistsSelected.length) {
          selected = selected.filter(
            (id) => !gistsSelected.find((gist) => gist.id === id)
          );
          actions.setSelected(selected);
          return;
        }

        gistsOnPage.map((gist) => {
          if (!selected.includes(gist.id)) {
            selected.push(gist.id);
          }
        });

        actions.setSelected(selected);
      }

      if (
        /(digit|numpad)[0-9]/i.test(event.code) &&
        (event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault();

        const keyNumber = parseInt(event.code.replace(/(digit|numpad)/gi, ''));

        if (event.shiftKey) {
          if (
            0 !== state.selected.length &&
            !(keyNumber > state.folders.length)
          ) {
            if (0 !== state.selected.length) {
              const folderID = getFolderID(state, keyNumber);
              actions.addOrRemoveFromFolder(folderID);
              save(state);
              return;
            }
          }

          return;
        }

        if (
          'number' === typeof keyNumber &&
          !(keyNumber > state.folders.length)
        ) {
          toggleFolder(state, actions, getFolderID(state, keyNumber));
        }
      }
    };

    fetch('userdata').then((response) => {
      response
        .text()
        .then((text) => {
          const data = text && text.length ? JSON.parse(text) : '';

          if (data) {
            actions.setSettings({
              ...state.settings,
              ...data.settings,
            });
            actions.setFolders(data.folders);
          }
        })
        .then(() => {
          fetch('cache').then((response) => {
            response.text().then((text) => {
              const data = text && text.length ? JSON.parse(text) : '';

              if (
                state.settings.use_cache &&
                data &&
                'number' === typeof state.settings.per_page
              ) {
                actions.setSourceGists(data);
                actions.setFilteredGists(data);
                paginateGists(state.settings.per_page, state, actions);
                clearFoldersCache(state, actions);
                actions.setLoaded(true);
              } else {
                fetchGists(page);
              }
            });
          });
        });
    });
  }, []);

  const fetchGists = (page: number) => {
    fetch(`gists?page=${page}&per_page=100`)
      .then((response) => response.json())
      .then((data) => {
        const currentGists = [...state.gists.source];

        actions.setSourceGists(currentGists.concat(data));
        if ('number' === typeof state.settings.per_page) {
          paginateGists(state.settings.per_page, state, actions);
        }

        if (data.length < 100 && 'number' === typeof state.settings.per_page) {
          actions.setFilteredGists([...state.gists.source]);
          paginateGists(state.settings.per_page, state, actions);
          saveCache(state);
          clearFoldersCache(state, actions);
          actions.setLoaded(true);
          return;
        }

        if (100 === data.length) {
          fetchGists(page + 1);
          setPage(page + 1);
        }
      });
  };

  const resetFolder = () => {
    if (0 === state.folder) {
      return;
    }

    actions.setFolder(0);

    if ('number' === typeof state.settings.per_page) {
      paginateGists(state.settings.per_page, state, actions);
    }
  };

  const invertedClass = state.settings.inverted_colors ? 'dark' : '';
  const boldClass = 0 === state.folder ? 'font-bold' : '';
  const reverseClass = state.settings.pagination_top ? 'flex-col-reverse' : '';
  const wrapperClassLeft = state.settings.sidebar_hidden
    ? 'md:pr-[22px]'
    : 'md:pr-[260px]';
  const wrapperClassRight = state.settings.sidebar_hidden
    ? 'md:pl-[22px]'
    : 'md:pl-[260px]';
  const wrapperClass = state.settings.sidebar_right
    ? wrapperClassLeft
    : wrapperClassRight;
  const sidebarClass = state.settings.sidebar_right ? 'right-0' : 'left-0';
  const foldersTabClass = state.settingsOpen
    ? 'text-gray-400'
    : 'border-b-2 border-gray-700';
  const settingsTabClass = state.settingsOpen
    ? 'border-b-2 border-gray-700'
    : 'text-gray-400';
  const sidebarChevronShown = state.settings.sidebar_right
    ? 'chevron-left'
    : 'chevron-right';
  const sidebarChevronHidden = state.settings.sidebar_right
    ? 'chevron-right'
    : 'chevron-left';
  const sidebarChevron = state.settings.sidebar_hidden
    ? sidebarChevronShown
    : sidebarChevronHidden;
  const sidebarChevronX = state.settings.sidebar_right ? 'right-0' : 'left-0';
  const sidebarStyle = state.settings.sidebar_hidden ? 'shadow bg-white' : '';

  return (
    <div className={`${invertedClass} bg-gray-100 h-full`}>
      {state.loaded && <GDPR />}
      <div className={`h-full relative ${wrapperClass}`}>
        <div
          className={`${sidebarChevronX} ${sidebarStyle} fixed top-0 w-4 h-full z-10 text-gray-600 cursor-pointer hidden md:block`}
          onClick={() => {
            actions.toggleSetting('sidebar_hidden');
            save(state);
          }}
        >
          <div className="absolute top-1/2 left-0 -translate-y-1/2">
            <div className="cursor-pointer relative group">
              <Icon type={sidebarChevron} classes="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="p-4">
          {!state.settings.sidebar_hidden && (
            <div
              className={`w-[260px] bottom-0 bg-white p-6 hidden md:block fixed top-0 shadow ${sidebarClass}`}
            >
              <Loading />
              <UserProfile />

              <div className="flex leading-[24px] my-10 text-sm justify-between">
                <div
                  className={`${foldersTabClass} flex justify-center px-2 pb-2 cursor-pointer hover:text-gray-700 transition-colors`}
                  onClick={() => actions.setSettingsOpen(false)}
                >
                  <Icon type="folders" classes="w-6 h-6" />
                  <span className="ml-2">Folders</span>
                </div>

                <div
                  className={`${settingsTabClass} flex justify-center px-2 pb-2 cursor-pointer hover:text-gray-700 transition-colors`}
                  onClick={() => actions.setSettingsOpen(true)}
                >
                  <Icon type="cog" classes="w-6 h-6" />
                  <span className="ml-2">Settings</span>
                </div>
              </div>

              {!state.settingsOpen && (
                <>
                  <div className="flex text-sm leading-[24px] text-gray-900">
                    <Icon type="code" classes="w-6 h-6" />
                    <div
                      className={`${boldClass} ml-2 w-full flex justify-between cursor-pointer`}
                      onClick={() => resetFolder()}
                    >
                      <p>All Gists</p>
                      <span className="text-xs leading-[24px]">
                        {state.gists.source.length}
                      </span>
                    </div>
                  </div>

                  {state.settings.show_selected_count && (
                    <div className="flex text-sm leading-[24px] text-gray-500 mt-2">
                      <Icon type="check" classes="w-6 h-6" />
                      <div className="ml-2 w-full flex justify-between">
                        <p>Selected</p>
                        <span className="text-xs leading-[24px]">
                          {state.selected.length}
                        </span>
                      </div>
                    </div>
                  )}

                  <Folders />
                </>
              )}
              {state.settingsOpen && <SettingsList />}
            </div>
          )}

          <Filter fetchGists={fetchGists} />
          <div className={`flex flex-wrap ${reverseClass}`}>
            <GistList />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
