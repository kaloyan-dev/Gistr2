import React from 'react';
import { useAppState } from '../overmind';

const Loading = () => {
    const state = useAppState();

    return (
        <>
            { ! state.loaded && <div className="absolute top-0 left-0 w-full h-full bg-white animate-pulse cursor-wait opacity-90 z-10"></div> }
        </>
    );
};

export default Loading;
