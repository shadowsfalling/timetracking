<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;


class CategoryController extends Controller
{
 
    public function index(Request $request) {
        $user_id = $request->user()->id;

        $suggestions = Category::where('user_id', '=', $user_id)->get();

        return $suggestions;
    }

    public function suggest(Request $request)
    {
        $request->validate([
            'word' => 'required|string|max:255',
        ]);

        $word = $request->input('word');
        $user_id = $request->user()->id;

        $suggestions = Category::where('name', 'LIKE', "%$word%")->where('user_id', '=', $user_id)->pluck('name');

        return response()->json(['suggestions' => $suggestions]);
    }

}