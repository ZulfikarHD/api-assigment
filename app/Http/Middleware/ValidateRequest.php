<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class ValidateRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $ruleset
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string $ruleset): Response
    {
        $validator = Validator::make($request->all(), $this->getRules($ruleset));

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        return $next($request);
    }

    /**
     * Get the validation rules based on the ruleset parameter.
     *
     * @param  string  $ruleset
     * @return array<string, string>
     */
    private function getRules(string $ruleset): array
    {
        return match ($ruleset) {
            'user.create' => [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'age' => 'required|integer|min:0',
            ],
            'user.update' => [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|string|email|max:255|unique:users,email,' . request()->route('user'),
                'age' => 'sometimes|integer|min:0',
            ],
            default => [],
        };
    }
}
