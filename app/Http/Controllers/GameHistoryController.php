<?php

namespace App\Http\Controllers;

use App\Models\GameHistory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Http\Request;

class GameHistoryController extends Controller
{
    use HasFactory;

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer'],
            'mistakes' => ['required', 'integer'],
            'moves' => ['required', 'integer'],
            'level_reached' => ['required', 'integer'],
            'timer' => ['required', 'integer'],
            'points' => ['required', 'integer'],
            'result' => ['required', 'boolean'],
        ]);

        $gameHistory = GameHistory::create($validated);
    }
}
