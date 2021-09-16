import React, { FC } from 'react';
import { name, username, avatar, anonymous } from '../helpers/userdata';
import { useAppState } from '../overmind';

const UserProfile: FC = () => {
    const state = useAppState();

    return (
        <div className="text-center">
            <a href={`https://github.com/${username}`} target="_blank" className="inline-block mb-4">
                <img className="w-20 h-20 rounded-full block" src={state.settings.hide_user_info ? `${anonymous}` : `${avatar}`} alt="" />
            </a>

            <p className="text-gray-700 text-sm leading-tight">{state.settings.hide_user_info ? 'Anonymous' : name}</p>
            <a href="logout" className="text-red-500 text-xs">Logout</a>
        </div>
    );
};

export default UserProfile;
