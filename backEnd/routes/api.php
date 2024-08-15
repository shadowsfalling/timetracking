<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TimeslotController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/categories', [CategoryController::class, 'index']);

    Route::post('/categories/suggest', [CategoryController::class, 'suggest']);
    Route::post('/activities/create-or-suggest', [ActivityController::class, 'createOrSuggest']);
    Route::get('/activities/today', [ActivityController::class, 'getTodayActivities']);
    Route::get('/activities', [ActivityController::class, 'getDateActivities']);
    Route::get('/activities/grouped-by-date', [ActivityController::class, 'getActivitiesGroupedByDate']);

    Route::apiResource('projects', ProjectController::class);
    Route::get('timeslots/{timeslot}', [TimeslotController::class, 'show']);
    Route::delete('timeslots/{timeslot}', [TimeslotController::class, 'destroy']);
    Route::get('timeslots', [TimeslotController::class, 'index']);
    Route::post('timeslots', [TimeslotController::class, 'store']);
    Route::put('timeslots/{timeslot}', [TimeslotController::class, 'update']);
    Route::get('timeslots/project/{projectId}/today', [TimeslotController::class, 'getTodayTimeslots']);

    Route::post('timeslots/full', [TimeslotController::class, 'storeFull']);
    Route::put('timeslots/{timeslot}/full', [TimeslotController::class, 'updateFull']);


    Route::get('activities/{id}', [ActivityController::class, 'show']);
    Route::put('activities/{id}', [ActivityController::class, 'update']);

    Route::get('timeslots/project/{projectId}/summary/today', [TimeslotController::class, 'getDailySummary']);
    Route::get('timeslots/project/{projectId}/summary', [TimeslotController::class, 'getDaySummary']);
    Route::get('timeslots/project/{projectId}/summary/month', [TimeslotController::class, 'getMonthSummary']);
});
