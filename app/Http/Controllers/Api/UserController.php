<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function getAllUsers()
    {
        $users = User::select('id', 'name', 'email', 'age')->get();
        return response()->json($users);
    }

    public function getUserById($id)
    {
        $user = User::select('id', 'name', 'email', 'age')->find($id);
        return response()->json($user);
    }

    public function createUser(Request $request)
    {
        $user = User::create($request->all());
        return response()->json($user);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        $user->update($request->all());
        return response()->json($user);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
