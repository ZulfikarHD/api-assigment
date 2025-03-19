<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Http\Response;
use Exception;

class UserController extends Controller
{
    /**
     * Get all users from the database.
     *
     * This method retrieves all users with selected fields (id, name, email, age).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllUsers()
    {
        try {
            $users = User::select('id', 'name', 'email', 'age')->get();
            return response()->json($users, Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to retrieve users'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get a specific user by their ID.
     *
     * This method finds and returns a user with the specified ID.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserById($id)
    {
        try {
            $user = User::select('id', 'name', 'email', 'age')->find($id);

            if (!$user) {
                return response()->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }

            return response()->json($user, Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to retrieve user'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Create a new user.
     *
     * This method creates a new user with the provided request data.
     * Validation is handled by middleware.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createUser(Request $request)
    {
        try {
            // Validation now handled by middleware
            $user = User::create($request->all());
            return response()->json($user, Response::HTTP_CREATED);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to create user'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update an existing user.
     *
     * This method updates a user with the specified ID using the provided request data.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }

            $user->update($request->all());
            return response()->json($user, Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to update user'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete a user.
     *
     * This method removes a user with the specified ID from the database.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteUser($id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }

            $user->delete();
            return response()->json(['message' => 'User deleted successfully'], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to delete user'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
