<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\ItemResources;
use App\Http\Resources\SubItemResources;
use App\Http\Resources\UserResource;
use App\Models\Item;
use App\Models\SubItem;
use App\Models\UserItemSubItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if( !$this->Checkpermistion(4)){
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        return UserResource::collection(
            User::query()->where('users.isdeleted','false') ->orderBy('id', 'desc')->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        if( !$this->Checkpermistion(1)){
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }

        $data = $request->validated();
      //  $role = $request->role;
        $data['password'] = bcrypt($data['password']);

        $user = User::create($data);
        $items=Item::all();
        $subItems=SubItem::all();
        if($data['role']!='Admin')
        {
            if($data['role']!='Fornisseur')
           {
            $items= Item::select("*")
            ->whereNotIn('id', [1, 2])
            ->get();
            }
            else{
             $items= Item::select("*")
            ->whereIn('id', [11,12])
            ->get();
            }
        }
        foreach( $items as $item)
          {   foreach( $subItems as $sitem)
            {
                $data=['iduser'=>$user->id,
                'iditem'=>$item->id,
                'idsubitem'=>$sitem->id,
                'iduserCreated'=>1,
                'iduserUpdated'=>1,
                ];
                UserItemSubItem::create($data);
            }}



        return response(new UserResource($user), 200);
    }

    public function getItems()
    {
        if( !$this->Checkpermistion(4)){
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $users = Auth()->user();
        $Items = [];

        return response(compact('Items', 'Items', 'SubItems'), 200);
    }
    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        if( !$this->Checkpermistion(2)){
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $data = $request->validated();
        $items=Item::all();
        $ur=Auth()->user();
        $subItems=SubItem::all();
        if(isset($data['role'])){
        if(($data['role']!='Admin') )
        {
            if($data['role']!='Fornisseur')
            {
             $items= Item::select("*")
             ->whereNotIn('id', [1, 2])
             ->get();
             }
             else{
              $items= Item::select("*")
             ->whereIn('id', [11,12])
             ->get();
             }
        }
        //$user->Roles()->detach();
        UserItemSubItem::where('idUser',$user->id)->delete();
        foreach( $items as $item)
          {   foreach( $subItems as $sitem)
            {
                $data=['iduser'=>$user->id,
                'iditem'=>$item->id,
                'idsubitem'=>$sitem->id,
                'iduserUpdated'=> $ur->id,
                ];
                UserItemSubItem::create($data);
            }
        }
        }
            $user->update($data);
           // $user->refresh();
            return response( new UserResource($user),200);

     //   return response('Old password not correct', 422);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if( !$this->Checkpermistion(3)){
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
      //  $user->Roles()->detach();
      $data=['isdeleted'=>true];
        $user->isdeleted=true;
        $user->update( $data);
        return response('deleted', 200);
    }
    public function  checkpermistion($action){

        $iditem=2;
        $userauth=Auth::user();
        $user=User::find( $userauth->id);

    return $user->checkpermistion($iditem,$action);
     }

}
