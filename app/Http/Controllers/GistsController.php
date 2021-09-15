<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Auth;

class GistsController extends Controller
{
    public function index(Request $request) {
        $user = Auth::user();

        if (! $user) {
            return view('login');
        }

        return view('gists')->with([
            'user' => Auth::user(),
        ]);
    }

    public function gists(Request $request) {
        $page     = isset( $request->page ) ? intval( $request->page ) : 1;
        $per_page = isset( $request->per_page ) ? intval( $request->per_page ) : 15;
        $user     = Auth:: user();

        $response = Http::withHeaders([
            'Authorization' => "token {$user->auth_token}"
        ])->get('https://api.github.com/gists', [
            'page'     => $page,
            'per_page' => $per_page,
        ]);

        $gists = [];
        $gistsResponse = json_decode($response->getBody()->getContents(), true);

        foreach ($gistsResponse as $gist) {
            $gists[] = array(
                'id'   => $gist['id'],
                'name' => array_keys($gist['files'])[0],
                'page' => 1,
            );
        }

        return $gists;
    }

    public function loadUserdata() {
        $user = Auth::user();

        if (! $user) {
            return 0;
        }

        return $user->userdata;
    }

    public function saveUserdata(Request $request) {
        $user = Auth::user();

        if (! $user) {
            return 0;
        }

        $userdata = $request->userdata;

        if ($userdata) {
            $user->userdata = $userdata;
            $user->save();
        }
    }

    public function deleteUserdata(Request $request) {
        $user = Auth::user();

        if (! $user) {
            return 0;
        }

        $user->delete();
    }

    public function loadCache() {
        $user = Auth::user();

        if (! $user) {
            return 0;
        }

        return $user->cache;
    }

    public function saveCache(Request $request) {
        $user = Auth::user();

        if (! $user) {
            return 0;
        }

        $cache = $request->cache;

        if ($cache) {
            $user->cache = $cache;
            $user->save();
        }
    }

    public function logout() {
        Auth::logout();
        return redirect('/');
    }
}
