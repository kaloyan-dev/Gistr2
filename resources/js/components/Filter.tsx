import React, { useState, FC, useEffect, useRef } from 'react';
import { useAppState, useActions } from '../overmind';

import Icon from './Icon';
import Loading from './Loading';

import { useDebounce } from '../helpers/hooks';
import { paginateGists } from '../helpers/utils';

import { FilterProps } from '../types';

const Filter: FC = ({ fetchGists }: FilterProps) => {
  const state = useAppState();
  const { filter, settings } = state;
  const actions = useActions();
  const fieldPadding = settings.compact_mode ? 'p-2' : 'p-4';
  const iconMarginLeft = settings.compact_mode ? 'ml-2' : 'ml-4';
  const iconMarginRight = settings.compact_mode ? 'mr-2' : 'mr-4';

  const [inputFilter, setInputFilter] = useState<string>('');
  const debouncedFilter: string = useDebounce<string>(inputFilter, 200);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const filterTerm = inputFilter.trim();

    if (filterTerm === filter) {
      return;
    }

    actions.setFilter(filterTerm);

    if ('number' === typeof settings.per_page) {
      paginateGists(settings.per_page, state, actions);
    }
  }, [debouncedFilter]);

  return (
    <div className="flex justify-center items-center relative">
      <Loading />
      <div className="flex-1 bg-white border-b shadow">
        <form method="get" className="flex items-center text-gray-400">
          <Icon
            type="filter"
            classes={`${iconMarginLeft} w-6 h-6 transition-all`}
          />
          <input
            id="filter"
            type="text"
            placeholder="Filter by name"
            className={`${fieldPadding} text-gray-600 outline-none w-full transition-all`}
            onChange={(event) => setInputFilter(event.target.value)}
            onFocus={() => actions.setFilterFocus(true)}
            onBlur={() => actions.setFilterFocus(false)}
            ref={inputRef}
          />
          {filter !== '' && (
            <span
              className={`${iconMarginRight} transition-colors hover:text-gray-700`}
              onClick={() => {
                setInputFilter('');
                inputRef.current.value = '';
                inputRef.current.focus();
              }}
            >
              <Icon type="cancel" classes="w-6 h-6" />
            </span>
          )}
        </form>
      </div>

      {state.settings.use_cache && (
        <button
          className="flex justify-center items-center whitespace-nowrap ml-4 bg-white self-stretch px-4 shadow border-b text-gray-500 hover:text-gray-700 transition-all"
          onClick={(event) => {
            event.preventDefault();
            actions.setSourceGists([]);
            actions.setFilteredGists([]);
            actions.setMaxPage(1);
            actions.setLoaded(false);
            fetchGists(1);
          }}
        >
          <Icon
            type="reload"
            classes="size-5"
            tooltip="Fetch Gists &amp; Regenerate Cache"
          />
        </button>
      )}

      <a
        href="https://gist.github.com/"
        target="_blank"
        className="flex justify-center items-center whitespace-nowrap ml-4 bg-white self-stretch px-4 shadow border-b text-gray-500 hover:text-gray-700 transition-all"
      >
        <Icon type="plus" classes="size-5" tooltip="New Gist" />
      </a>
    </div>
  );
};

export default Filter;
