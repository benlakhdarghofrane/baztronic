<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;

use App\Http\Resources\UserResource;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    public function signup(SignupRequest $request)
    {
        $data =$request->validated();
        $user=User::create([
         'username'=>$data['username'],
         'email'=>$data['email'],
         'iddou'=>$data['iddou'],
         'admin'=>$data['admin'],
         'role'=>'',
         'password'=>bcrypt($data['password']), ]);
         $token =$user->createToken('Personal Access Token')->plainTextToken;

         return response(compact('user','token'));
    }
    public function login(LoginRequest $request)
    {
      $credentials=$request->validated();

    if(!Auth::attempt(['username'=>$credentials['username'] ,'password'=>$credentials['password']]))
      {
        return response([
            'message'=>'Provided user name or password is inccorect'
        ],422);
      }
      /** @var User */
     $user = new UserResource(Auth::User());
     if( $user->isdeleted){
        return response([
            'message'=>'User Does Not Exist or deleted'
        ],422);
     }
     $token=$user->createToken('Personal Access Token')->plainTextToken;
     /* $tags= TagResource::collection(tag::all());
     $rus= RuResource::collection(RU::query()->where('rus.idDou',$user->idDou)->get());
     $services= ServiceResource::collection(Service::all()); */
     return response(compact('user','token'),200);
    }
    public function Logout(Request $request)
    {
    // $userin=Auth()->user();
      $user = $request->user();
      $user->currentAccessToken()->delete();
        return response()->json([
            'message' => 'LOGOUT'
        ],200);
    }
}
