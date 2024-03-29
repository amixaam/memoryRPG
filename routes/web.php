<?php

use App\Http\Controllers\BackgroundsController;
use App\Http\Controllers\GameHistoryController;
use App\Http\Controllers\ProfileController;
use App\Models\Background;
use App\Models\GameHistory;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/', function () {
    return Inertia::render('Game', [
        'backgrounds' => Background::all(),
    ]);
})->middleware(['auth', 'verified'])->name('game');

Route::get('/stats', function () {
    return Inertia::render('Stats/View', [
        'backgrounds' => Background::all(),
        'statistics' => GameHistory::all(),
    ]);
})->middleware(['auth', 'verified'])->name('stats');


Route::post('/backgrounds', [BackgroundsController::class, 'create']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
