import React, { FC } from 'react';
import { useAppState, useActions } from '../overmind';
import Icon from './Icon';
import Loading from './Loading';

const Pagination: FC = () => {
  const actions = useActions();
  const { maxPage, viewPage, settings } = useAppState();
  const pages = Array.from(Array(maxPage).keys());

  if (maxPage < 2) {
    return null;
  }

  const paginationButtonsSize = settings.compact_mode
    ? 'min-w-[30px] min-h-[30px] mr-2 p-2'
    : 'min-w-[36px] min-h-[36px] mr-4 p-4';
  const paginationBorder = settings.pagination_top
    ? 'border-b-2'
    : 'border-t-2';
  const prevPage = viewPage - 1 > 0 ? viewPage - 1 : maxPage;
  const nextPage = viewPage + 1 <= maxPage ? viewPage + 1 : 1;

  return (
    <div className="relative mt-4 w-full">
      <Loading />
      <div
        className={`bg-white shadow flex justify-between items-center transition-all w-full`}
      >
        <span
          className={`${paginationButtonsSize} border-gray-400 text-gray-400 text-center cursor-pointer flex items-center justify-center select-none hover:text-gray-700`}
          onClick={() => actions.setViewPage(prevPage)}
        >
          <Icon type="arrow-left" classes="w-4 h-4 mr-2" />
          Prev
        </span>
        <span className="flex">
          {pages.map((page, index) => {
            const realPage = page + 1;
            const style =
              viewPage === realPage
                ? 'border-gray-700 text-gray-700'
                : 'border-white text-gray-400 hover:text-gray-700';

            return (
              <span
                key={index}
                className={`${paginationButtonsSize} ${paginationBorder} ${style} text-center cursor-pointer flex items-center justify-center select-none`}
                onClick={() => actions.setViewPage(realPage)}
              >
                {realPage}
              </span>
            );
          })}
        </span>
        <span
          className={`${paginationButtonsSize} border-gray-400 text-gray-400 text-center cursor-pointer flex items-center justify-center select-none hover:text-gray-700`}
          onClick={() => actions.setViewPage(nextPage)}
        >
          Next
          <Icon type="arrow-right" classes="w-4 h-4 ml-2" />
        </span>
      </div>
    </div>
  );
};

export default Pagination;
