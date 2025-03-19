<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Log the request
        $this->logRequest($request);

        // Process the request
        $response = $next($request);

        // Log the response
        $this->logResponse($request, $response);

        return $response;
    }

    /**
     * Log the request details
     *
     * @param Request $request
     * @return void
     */
    protected function logRequest(Request $request): void
    {
        $logData = [
            'time' => now()->toDateTimeString(),
            'ip' => $request->ip(),
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'user_agent' => $request->header('User-Agent'),
            'headers' => $request->headers->all(),
        ];

        // Only log request body for non-GET requests that aren't file uploads
        if (!$request->isMethod('GET') && count($request->allFiles()) === 0) {
            $logData['body'] = $request->except(['password', 'password_confirmation']);
        }

        Log::channel('requests')->info('Request', $logData);
    }

    /**
     * Log the response details
     *
     * @param Request $request
     * @param Response $response
     * @return void
     */
    protected function logResponse(Request $request, Response $response): void
    {
        // Don't log response content if it's too large or is a file
        $content = $response->getContent();
        $logContent = strlen($content) > 10000 ? '[Content too large to log]' : $content;

        Log::channel('requests')->info('Response', [
            'time' => now()->toDateTimeString(),
            'url' => $request->fullUrl(),
            'status' => $response->getStatusCode(),
            'status_text' => Response::$statusTexts[$response->getStatusCode()] ?? '',
            'content' => $logContent,
        ]);
    }
}
