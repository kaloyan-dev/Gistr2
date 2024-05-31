import React, { FC } from 'react'
import { useAppState } from '../overmind'
import { name, username, avatar, anonymous } from '../helpers/userdata'
import Loading from './Loading'

const UserProfile: FC = () => {
  const state = useAppState()
  const placeholder =
    'relative before:absolute before:top-1/2 before:left-1/2 before:-translate-x-2/4 before:-translate-y-2/4 before:w-1/2 before:h-2/5 before:rounded-md'

  if (!state.loaded) {
    return (
      <div className="relative text-center">
        <Loading />
        <div className="mb-4 w-full">
          <span className="w-20 h-20 rounded-full block mx-auto bg-gray-300"></span>
        </div>

        <p className={`${placeholder} before:bg-gray-300`}>-</p>
        <p className={`${placeholder} before:bg-red-300`}>-</p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <a
        href={`https://github.com/${username}`}
        target="_blank"
        className="inline-block mb-4"
      >
        <img
          className="w-20 h-20 rounded-full block"
          src={state.settings.hide_user_info ? `${anonymous}` : `${avatar}`}
          alt=""
        />
      </a>

      <p className="text-gray-700 text-sm leading-tight">
        {state.settings.hide_user_info ? 'Anonymous' : name}
      </p>
      <a href="logout" className="text-red-500 text-xs">
        Logout
      </a>
    </div>
  )
}

export default UserProfile
