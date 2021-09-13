import React, { FC } from 'react';
import { useAppState, useActions } from '../overmind';

const Pagination: FC = () => {
    const actions                         = useActions();
    const { maxPage, viewPage, settings } = useAppState();
    const padding                         = settings.compact_mode ? 'p-2': 'p-4';
    const pages                           = Array.from(Array(maxPage).keys());

    return (
        <div className={`${padding} bg-white shadow flex items-center transition-all w-full`}>
            {
                pages.map((page, index) => {
                    const realPage   = page + 1;
                    const background = viewPage === realPage ? 'bg-gray-700': 'bg-gray-400';

                    return (
                        <span key={index} className={`${background} block py-2 px-4 mr-4 text-white cursor-pointer`} onClick={() => actions.setViewPage(realPage)}>{realPage}</span>
                    );
                })
            }
        </div>
    );
}

export default Pagination;
