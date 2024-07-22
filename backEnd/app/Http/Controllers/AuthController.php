<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use OpenApi\Attributes as OA;

#[OA\Info(title: "TimeTracker API", version: "1.0")]
class AuthController extends Controller
{

    #[OA\Post(
        path: '/api/auth/register',
        summary: 'Register a new user',
        tags: ['Authentication'],
        requestBody: new OA\RequestBody(
            description: 'Data needed for registering a new user',
            required: true,
            content: new OA\MediaType(
                mediaType: 'application/json',
                schema: new OA\Schema(
                    type: 'object',
                    required: ['username', 'password', 'email'],
                    properties: [
                        new OA\Property(property: 'username', type: 'string', description: 'User`s username'),
                        new OA\Property(property: 'email', type: 'string', description: 'User`s email address'),
                        new OA\Property(property: 'password', type: 'string', description: 'User`s password')
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'User successfully registered'),
            new OA\Response(response: 400, description: 'Bad request')
        ]
    )]
    public function register(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
        ]);

        // todo: myAppToken aus env herausladen
        $token = $user->createToken('myapptoken')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response($response, 201);
    }

    #[OA\Post(
        path: '/api/auth/login',
        summary: 'User login',
        tags: ['Authentication'],
        requestBody: new OA\RequestBody(
            description: 'Data needed for user login',
            required: true,
            content: new OA\MediaType(
                mediaType: 'application/json',
                schema: new OA\Schema(
                    type: 'object',
                    required: ['username', 'password'],
                    properties: [
                        new OA\Property(property: 'username', type: 'string', description: 'User`s username'),
                        new OA\Property(property: 'password', type: 'string', description: 'User`s password')
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Login successful'),
            new OA\Response(response: 401, description: 'Login failed'),
            new OA\Response(response: 400, description: 'Bad request'),
            new OA\Response(response: 500, description: 'Internal server error')
        ]
    )]
    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $fields['email'])->first();

        if(!$user || !Hash::check($fields['password'], $user->password)) {
            return response([
                'message' => 'Bad credentials'
            ], 401);
        }

        $token = $user->createToken('myapptoken')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response($response, 201);
    }

    #[OA\Post(
        path: '/api/auth/logout',
        summary: 'User logout',
        tags: ['Authentication'],
        responses: [
            new OA\Response(response: 200, description: 'Login successful'),
            new OA\Response(response: 500, description: 'Internal server error')
        ]
    )]
    public function logout(Request $request)
    {

        if (!$request->user()) {
            return response()->json(['message' => 'No authenticated user.'], 401);
        }
    
        // Revoke all tokens...
        $request->user()->tokens()->delete();
    
        return response()->json(['message' => 'Logged out successfully']);
    }
}