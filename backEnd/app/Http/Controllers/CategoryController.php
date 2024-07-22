<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Activity;

class CategoryController extends Controller
{
 
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