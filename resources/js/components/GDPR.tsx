import React, { FC } from 'react'
import Icon from './Icon'
import { useAppState, useActions } from '../overmind'
import { save, deleteUser } from '../helpers/utils'

const GDPR: FC = () => {
  const state = useAppState()
  const actions = useActions()

  const agree = () => {
    actions.updateSettings({ hide_gdpr: true })
    save(state)
  }

  const deletePersonalInfo = () => {
    if (!confirm('Are you sure ? This action cannot be undone.')) {
      return
    }

    deleteUser()
  }

  if (state.settings.hide_gdpr) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 z-[10000] w-full h-full lg:text-xs bg-[#00000050]">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[90%] p-4 bg-white shadow rounded-sm">
        <h2 className="flex justify-center leading-[24px]">
          <Icon type="shield" classes="w-6 h-6" />
          <span className="ml-2">GDPR</span>
        </h2>
        <div className="mt-4">
          <p>
            This website uses{' '}
            <a
              className="text-blue-500 underline"
              href="https://en.wikipedia.org/wiki/HTTP_cookie"
              target="_blank"
            >
              cookies
            </a>{' '}
            just like the majority (if not all) of the websites you use on a
            daily basis.
          </p>
          <p className="mt-4">
            The personal information that is stored in the database includes
            your GitHub username, your real name and email (based on what you've
            provided in your GitHub profile) and a list of your Gists' IDs.
          </p>
          <p className="mt-4 text-blue-500">
            You can immediately delete all your personal information from the
            database by clicking the button bellow.
          </p>
          <p className="text-red-500">
            WARNING: You can't undo this action. Once you delete your
            information you will be logged out. You can recreate your profile by
            logging in with GitHub again but all your previous settings and
            folders will be lost.
          </p>
          <div className="flex justify-between mt-4">
            <button
              className="text-red-700 underline py-2 px-4 w-[50%]"
              onClick={deletePersonalInfo}
            >
              Delete Personal Information
            </button>
            <button
              className="text-white py-2 px-4 bg-green-500 w-[50%]"
              onClick={agree}
            >
              Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GDPR
