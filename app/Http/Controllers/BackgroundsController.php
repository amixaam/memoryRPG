<?php

namespace App\Http\Controllers;

use App\Models\Background;
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
}
