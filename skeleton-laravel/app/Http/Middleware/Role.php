<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Role
{
    /**
     * Handle an incoming request for restricted role.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  $roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $roles = empty($roles) ? [null] : $roles;
        $membershipType = Auth::user()->membership_type;
        $membershipTypes = [
            0 => 'trial',
            1 => 'student',
            2 => 'corporate',
            3 => 'admin',
        ];
        // Restrict access if membershipType does not match with given role parameters
        if (!in_array($membershipTypes[$membershipType], $roles))
            return response()->json(['error' => 'Unauthorized'], 403);

        return $next($request);
    }
}
