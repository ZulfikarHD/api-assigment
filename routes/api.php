<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;


Route::get('/users', [UserController::class, 'getAllUsers']);
Route::get('/users/{id}', [UserController::class, 'getUserById']);
Route::post('/users', [UserController::class, 'createUser'])->middleware('validate:user.create');
Route::put('/users/{id}', [UserController::class, 'updateUser'])->middleware('validate:user.update');
Route::delete('/users/{id}', [UserController::class, 'deleteUser']);