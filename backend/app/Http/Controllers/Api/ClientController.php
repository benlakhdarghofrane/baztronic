<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ResourceClient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (!$this->Checkpermistion(4)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        return ResourceClient::collection(
            Client::query()->where('clients.isdeleted','false')->orderBy('id', 'desc')->paginate()
        );

    }
    public function filter(Request $request)
    {
        if (!$this->Checkpermistion(4)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $fil= $request->filter;
        $isnopag= $request->has( 'nopag')?$request->nopag:0;
        if($isnopag==1)
        return ResourceClient::collection(
            Client::query()->where([['clients.isdeleted','false'],['clients.fullname', 'like', '%' . $fil . '%']])->orWhere([['clients.isdeleted','false'],['clients.phone', 'like', '%' . $fil . '%']]) ->orderBy('id', 'desc')->get()
        );

        return ResourceClient::collection(
            Client::query()->where([['clients.isdeleted','false'],['clients.fullname', 'like', '%' . $fil . '%']])->orWhere([['clients.isdeleted','false'],['clients.phone', 'like', '%' . $fil . '%']]) ->orderBy('id', 'desc')->paginate()
        );

    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientRequest $request)
    {
        if (!$this->Checkpermistion(1)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $user = Auth()->user();
        $data= $request->validated();
        $data['idUser']=$user->id;
        $cat=Client::create($data);
        return response(new ResourceClient($cat),200);

    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        return response(new ResourceClient( $client),200);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, Client $client)
    {
        if (!$this->Checkpermistion(2)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $user = Auth()->user();
        $data= $request->validated();
        $data['idUser']=$user->id;
        $client->update($data);
        return response(new ResourceClient( $client),200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        if (!$this->Checkpermistion(3)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }

        $client->isdeleted = true;
        $client->update();
        return response('deleted', 200);
    }
    public function  checkpermistion($action)
    {
        $iditem = 8;
        $userauth = Auth::user();
        $user = User::find($userauth->id);
        return $user->checkpermistion($iditem, $action);
    }
}
