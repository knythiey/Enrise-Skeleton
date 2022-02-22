<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

  /**
   * @param Request $request
   * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|Response
   */
  public function login(Request $request)
  {
    $fields = $request->validate([
      'email' => 'required|string',
      'password' => 'required|string',
    ]);

    // check user authorization
    $user = User::where('email', $fields['email'])->first();
    if (!$user || !Hash::check($fields['password'], $user->password)) {
      return response([
        'message' => 'Invalid credentials'
      ], 401);
    }

    $user['date_registered'] = date('Y/m/d', strtotime($user->created_at));
    $user['plan'] = $user->plan;

    if ($user['membership_type'] > 1) {
      $user['all_user_count'] = UserController::getAllUserCount();
    }

    //    $request->session()->put('user', $user);

    $token = $user->createToken('access_token')->plainTextToken;

    $response = [
      'user' => $user,
      'access_token' => $token,
      'message' => 'Login Successful!'
    ];

    return response($response, 200);
  }

  /**
   * @param Request $request
   * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|Response
   */
  public function logout(Request $request)
  {
    auth()->user()->tokens()->delete();

    //    $request->session()->forget('user');

    return response([
      'message' => 'Logged out successfully'
    ], 200);
  }
}
