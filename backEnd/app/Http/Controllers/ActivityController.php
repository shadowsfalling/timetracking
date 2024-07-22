<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Activity;
use Carbon\Carbon;

class ActivityController extends Controller
{
    public function createOrSuggest(Request $request)
    {
        $request->validate([
            'word' => 'required|string|max:255',
        ]);

        $word = $request->input('word');
        $user_id = $request->user()->id;

        $category = Category::where('name', $word)->where('user_id', '=', $user_id)->first();

        if (!$category) {
            $category = Category::create(['name' => $word, 'color' => $this->generateRandomColor(), 'user_id' => $user_id]);
        }

        $activity = Activity::create([
            'name' => $word,
            'user_id' => $user_id,
            'category_id' => $category->id,
        ]);

        return response()->json([
            'message' => 'Activity created.',
            'activity' => $activity,
            'category' => $category,
        ], 201);
    }

    public function generateRandomColor()
    {
        $color = sprintf('#%06X', mt_rand(0, 0xFFFFFF));
        return $color;
    }

    /**
     * Get all activities for the current day.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTodayActivities()
    {
        $today = Carbon::today();

        $activities = Activity::whereDate('created_at', $today)->get();

        return response()->json($activities);
    }

    /**
     * Get all activities grouped by date.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getActivitiesGroupedByDate()
    {
        $activities = Activity::selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($activities);
    }
}