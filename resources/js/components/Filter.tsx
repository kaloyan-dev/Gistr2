import React, { useState, FC, useEffect } from 'react';
import { useAppState, useActions } from '../overmind';

import Loading from './Loading';

import { useDebounce } from '../helpers/hooks';
import { paginateGists } from '../helpers/utils';

const Filter: FC = () => {
  const state = useAppState();
  const { filter, settings } = state;
  const actions = useActions();
  const padding = settings.compact_mode ? 'p-2' : 'p-4';

  const [inputFilter, setInputFilter] = useState<string>('');
  const debouncedFilter: string = useDebounce<string>(inputFilter, 200);

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
    <div className="bg-white border-b shadow relative">
      <Loading />
      <form method="get">
        <input
          id="filter"
          type="text"
          placeholder="Filter by name"
          className={`${padding} text-gray-600 outline-none w-full transition-all`}
          onChange={(event) => setInputFilter(event.target.value)}
          onFocus={() => actions.setFilterFocus(true)}
          onBlur={() => actions.setFilterFocus(false)}
        />
      </form>
    </div>
  );
}

export default Filter;
