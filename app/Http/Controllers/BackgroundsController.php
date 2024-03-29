<?php

namespace App\Http\Controllers;

use App\Models\Background;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BackgroundsController extends Controller
{
    public function create(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'colors' => 'required|array',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['request' => $request->all(), 'errors' => $e->errors()], 422);
        }


        Background::create([
            'name' => $request->name,
            'colors' => json_encode($request->colors),
        ]);

        return response()->json(['message' => 'Form data processed successfully']);
    }


    public function index()
    {
        return response()->json(['backgrounds' => Background::all()]);
    }

    public function unlock(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
        ]);

        $user = User::find(auth()->id());
        $unlocks = $user->unlocks ? $user->unlocks : [];

        $unlocks[] = $request->id;

        $user->update(['unlocks' => array_unique($unlocks)]);
    }

    public function buy(Request $request)
    {

        $request->validate([
            'name' => 'required|string',
            'price' => 'required|integer',
        ]);

        $user = User::find(auth()->id());
        $user->decrement('currency', $request->price);
        if ($request->name != 'Theme lootbox') $user->increment('powerups');
        $user->save();
    }

    public function usePowerup()
    {
        $user = User::find(auth()->id());
        $user->decrement('powerups');
        $user->save();
    }
}
