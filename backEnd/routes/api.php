<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CountdownController;
use App\Http\Controllers\CategoryController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group( function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// // Countdown routes
// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/countdowns/upcoming', [CountdownController::class, 'showAllUpcoming']);
//     Route::get('/countdowns/expired', [CountdownController::class, 'showAllExpired']);
//     Route::get('/countdown/{id}', [CountdownController::class, 'get']);
//     Route::post('/countdowns', [CountdownController::class, 'create']);
//     Route::put('/countdowns/{id}', [CountdownController::class, 'update']);
//     Route::delete('/countdowns/{id}', [CountdownController::class, 'delete']);
    
// });

// // Category routes
// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/categories', [CategoryController::class, 'index']);
//     Route::post('/categories', [CategoryController::class, 'create']);
//     Route::get('/category/{id}', [CategoryController::class, 'get']);
//     Route::put('/categories/{id}', [CategoryController::class, 'update']);
//     Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
// });