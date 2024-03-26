<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameHistory extends Model
{
    use HasFactory;

    protected $table = 'game_history';

    protected $fillable = [
        'user_id',
        'mistakes',
        'moves',
        'level_reached',
        'timer',
        'points',
        'result'
    ];
}
