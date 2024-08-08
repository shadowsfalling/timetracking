<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Timeslot;
use App\Models\Project;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class TimeslotController extends Controller
{

    // todo: is_numeric and is project existing???

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

    public function storeFull(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'project_id' => 'required|exists:projects,id',
            'start' => 'required|date',
            'end' => 'required|date'
        ]);

        $timeslot = Timeslot::create([
            'name' => $request->name,
            'start' => $request->start,
            'end' => $request->end,
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

    public function updateFull(Request $request, Timeslot $timeslot)
    {
        $timeslot->update([
            'name' => $request->name,
            'start' => $request->start,
            'end' => $request->end,
            'project_id' => $request->project_id
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

    public function getDaySummary($projectId, Request $request)
    {
        $request->validate([
            'date' => 'required|date_format:Y-m-d',
        ]);

        $userId = Auth::id();

        $project = Project::find($projectId);
        $defaultDuration = $project->default_duration / 1000; // Konvertiere Millisekunden in Sekunden

        $startOfToday = Carbon::createFromFormat('Y-m-d', $request->date)->startOfDay();
        $endOfToday = Carbon::createFromFormat('Y-m-d', $request->date)->endOfDay();

        $timeslots = Timeslot::where('project_id', $projectId)
            ->where('user_id', $userId)
            ->whereBetween('start', [$startOfToday, $endOfToday])
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

        $possibleEndTime = $lastEndTime ? $lastEndTime->copy()->addSeconds($remainingTime) : Carbon::now()->addSeconds($remainingTime);

        return response()->json([
            'totalTime' => $totalTime,
            'possibleEndTime' => $possibleEndTime ? $possibleEndTime->toDateTimeString() : null,
        ]);
    }

    public function getMonthSummary($projectId, Request $request)
    {
        $request->validate([
            'date' => 'required|date_format:Y-m-d',
        ]);

        if (!is_numeric($projectId)) {
            abort(400, "project has the wrong format");
        }

        $userId = Auth::id();

        $project = Project::find($projectId);
        $defaultDuration = $project->default_duration;

        $startOfMonth = Carbon::createFromFormat('Y-m-d', $request->date)->startOfMonth();
        $endOfMonth = Carbon::createFromFormat('Y-m-d', $request->date)->endOfMonth();

        $timeslots = Timeslot::where('project_id', $projectId)
            ->where('user_id', $userId)
            ->whereBetween('start', [$startOfMonth, $endOfMonth])
            ->orderBy('start', 'asc')
            ->get();

        $totalTime = 0;
        $dailySummaries = [];

        // Initialize dailySummaries array with zeros for each day of the month
        for ($date = $startOfMonth->copy(); $date->lessThanOrEqualTo($endOfMonth); $date->addDay()) {
            $dailySummaries[$date->format('Y-m-d')] = 0;
        }

        foreach ($timeslots as $timeslot) {
            $start = Carbon::parse($timeslot->start);
            $end = $timeslot->end ? Carbon::parse($timeslot->end) : Carbon::now();
            if ($start->lessThanOrEqualTo($end)) {
                $diffInSeconds = $start->diffInSeconds($end);
                $totalTime += $diffInSeconds;

                // Add the time to the respective day in the dailySummaries array
                $day = $start->format('Y-m-d');
                $dailySummaries[$day] += $diffInSeconds;
            }
        }

        // Calculate working days in the month
        $workingDays = $startOfMonth->diffInDaysFiltered(function (Carbon $date) {
            return !$date->isWeekend();
        }, $endOfMonth);

        $monthlyDefaultDuration = $workingDays * $defaultDuration;
        $remainingTime = $monthlyDefaultDuration - $totalTime;

        return response()->json([
            'totalTime' => $totalTime,
            'monthlyDefaultDuration' => $monthlyDefaultDuration,
            'remainingTime' => $remainingTime,
            'dailySummaries' => $dailySummaries,
        ]);
    }
}
