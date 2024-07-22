<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\CategoryController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/categories/suggest', [CategoryController::class, 'suggest']);
    Route::post('/activities/create-or-suggest', [ActivityController::class, 'createOrSuggest']);
    Route::get('/activities/today', [ActivityController::class, 'getTodayActivities']);
    Route::get('/activities/grouped-by-date', [ActivityController::class, 'getActivitiesGroupedByDate']);
});
