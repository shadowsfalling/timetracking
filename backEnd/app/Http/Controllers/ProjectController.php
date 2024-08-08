<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index()
    {
        return Project::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'required|string|max:7',
            'user_id' => 'nullable|exists:users,id',
            'default_duration' => 'required|integer'
        ]);

        $project = Project::create($request->all());

        return response()->json($project, 201);
    }

    public function show(Project $project)
    {
        return $project;
    }

    public function update(Request $request, Project $project)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'required|string|max:7',
            'user_id' => 'nullable|exists:users,id',
            'default_duration' => 'required|integer',
        ]);

        $project->update($request->all());

        return response()->json($project, 200);
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return response()->json(null, 204);
    }
}