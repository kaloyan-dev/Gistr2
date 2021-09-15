<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GistsController;
use App\Http\Controllers\Auth\LoginController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [GistsController::class, 'index']);
Route::get('/gists', [GistsController::class, 'gists']);
Route::get('/userdata', [GistsController::class, 'loadUserdata']);
Route::post('/userdata', [GistsController::class, 'saveUserdata']);
Route::delete('/userdata', [GistsController::class, 'deleteUserdata']);
Route::get('/cache', [GistsController::class, 'loadCache']);
Route::post('/cache', [GistsController::class, 'saveCache']);
Route::get('logout',  [GistsController::class, 'logout']);
Route::get('auth/github', [LoginController::class, 'redirectToProvider'])->name('auth');
Route::get('auth/github/callback', [LoginController::class, 'handleProviderCallback']);
