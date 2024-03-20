<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Background extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'colors',
    ];

    protected $casts = [
        'colors' => 'array',
    ];
    public $timestamps = false;
}
