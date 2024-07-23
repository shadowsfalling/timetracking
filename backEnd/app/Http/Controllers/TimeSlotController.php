<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Timeslot;
use App\Models\Project;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class TimeslotController extends Controller
{
    public function index()
    {
        return Timeslot::all();
    }


    public function show(Timeslot $timeslot)
    {
        return $timeslot;
    }

    public function destroy(Timeslot $timeslot)
    {
        $timeslot->delete();

        return response()->json(null, 204);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'project_id' => 'required|exists:projects,id'
        ]);

        $timeslot = Timeslot::create([
            'name' => $request->name,
            'start' => Carbon::now()->toDateTimeString(),
            'user_id' => Auth::id(),
            'project_id' => $request->project_id
        ]);

        return response()->json($timeslot, 201);
    }

    public function update(Request $request, Timeslot $timeslot)
    {
        $timeslot->update([
            'end' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        return response()->json($timeslot, 200);
    }

    public function getTodayTimeslots($projectId)
    {
        $today = Carbon::today();
        $timeslots = Timeslot::where('project_id', $projectId)
            ->whereDate('start', $today)
            ->get();

        return response()->json($timeslots);
    }

    public function getDailySummary($projectId)
    {
        $userId = Auth::id();

        $project = Project::find($projectId);
        $defaultDuration = $project->default_duration;

        $startOfToday = Carbon::today();

        $timeslots = Timeslot::where('project_id', $projectId)
            ->where('user_id', $userId)
            ->where('start', '>=', $startOfToday)
            ->orderBy('start', 'asc')
            ->get();

        $totalTime = 0;
        $lastEndTime = null;
        foreach ($timeslots as $timeslot) {
            $start = Carbon::parse($timeslot->start);
            $end = $timeslot->end ? Carbon::parse($timeslot->end) : Carbon::now();
            if ($start->lessThanOrEqualTo($end)) {
                $diffInSeconds = $start->diffInSeconds($end);
                $totalTime += $diffInSeconds;
                $lastEndTime = $end;
            }
        }

        $remainingTime = $defaultDuration - $totalTime;

        $possibleEndTime = Carbon::now()->addSeconds($remainingTime);
        return response()->json([
            'totalTime' => $totalTime,
            'possibleEndTime' => $possibleEndTime ? $possibleEndTime->toDateTimeString() : null,
        ]);
    }
}
