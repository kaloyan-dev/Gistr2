<?php

namespace App\Http\Controllers\Auth;

use Auth;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;

class LoginController extends Controller
{
    /**
     * Redirect the user to the GitHub authentication page.
     *
     * @return \Illuminate\Http\Response
     */
    public function redirectToProvider() {
        return Socialite::driver('github')->scopes(['gist'])->redirect();
    }

    /**
     * Obtain the user information from GitHub.
     *
     * @return \Illuminate\Http\Response
     */
    public function handleProviderCallback() {
        try {
            $user = Socialite::driver('github')->stateless()->user();
        } catch (Exception $e) {
            return redirect('login/github');
        }

        $authUser = $this->findOrCreateUser($user);

        Auth::login($authUser, true);

        return redirect('/');
    }

    private function findOrCreateUser($user) {
        $user = User::firstOrCreate(['github_id' => $user->id])->fill([
            'username'   => $user->nickname,
            'name'       => $user->name,
            'email'      => $user->email,
            'github_id'  => $user->id,
            'avatar'     => $user->avatar,
            'auth_token' => $user->token,
        ]);

        $user->save();

        return $user;
    }

    public function logout() {
        Auth::logout();

        return redirect('/');
    }
}
