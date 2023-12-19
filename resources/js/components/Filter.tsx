import React, { useState, FC, useEffect, useRef } from 'react';
import { useAppState, useActions } from '../overmind';

import Icon from './Icon';
import Loading from './Loading';

import { useDebounce } from '../helpers/hooks';
import { paginateGists } from '../helpers/utils';

const Filter: FC = () => {
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
        <div className="bg-white border-b shadow relative">
            <Loading />
            <form method="get" className="flex items-center text-gray-400">
                <Icon type="filter" classes={`${iconMarginLeft} w-6 h-6 transition-all`} />
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
                {
                    filter !== '' && (
                        <span className={`${iconMarginRight} transition-all hover:text-gray-700`} onClick={() => {
                            setInputFilter('');
                            inputRef.current.value = '';
                            inputRef.current.focus();
                        }}>
                            <Icon type="cancel" classes="w-6 h-6" />
                        </span>
                    )
                }
            </form>
        </div>
    );
}

export default Filter;
