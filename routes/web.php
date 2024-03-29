<?php

use App\Http\Controllers\BackgroundsController;
use App\Http\Controllers\GameHistoryController;
use App\Http\Controllers\ProfileController;
use App\Models\Background;
use App\Models\GameHistory;
use App\Models\User;
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
        'unlocks' => auth()->user()->unlocks ? auth()->user()->unlocks : [],
        'backgrounds' => Background::all(),
        'dbPoints' => auth()->user()->currency ?? 0,
        'powerups' => auth()->user()->powerups ?? 0,
    ]);
})->middleware(['auth', 'verified'])->name('game');

Route::get('/stats', function () {
    return Inertia::render('Stats/View', [
        'statistics' => GameHistory::where('user_id', auth()->id())->get(),
        'leaderboard' => GameHistory::select('user_id', 'points', 'created_at')
            ->orderByDesc('points')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return array_merge($item->toArray(), [
                    'name' => User::find($item->user_id)->name,
                ]);
            })->toArray(),
    ]);
})->middleware(['auth', 'verified'])->name('stats');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/backgrounds', [BackgroundsController::class, 'create']);
    Route::post('/stats/store', [GameHistoryController::class, 'store'])->name('gameHistory.store');

    Route::patch('/user/unlocks', [BackgroundsController::class, 'unlock']);
    Route::patch('/user/purchase', [BackgroundsController::class, 'buy']);
    Route::patch('/user/use-powerup', [BackgroundsController::class, 'usePowerup']);
});

require __DIR__ . '/auth.php';
