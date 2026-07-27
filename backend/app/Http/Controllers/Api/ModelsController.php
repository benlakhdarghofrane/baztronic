<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Models;
use App\Http\Requests\StoreModelsRequest;
use App\Http\Requests\UpdateModelsRequest;
use App\Http\Resources\ModelsResources;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ModelsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ModelsResources::collection(
            Models::query()->where('models.isdeleted','false') ->orderBy('id', 'desc')->paginate()
        );
    }

    public function Modelsbymareques(Request $request)
    {
        $idmarq=$request->idmareque;
        return ModelsResources::collection(
            Models::query()->where([['models.isdeleted','false'],['models.idmareque',$idmarq]]) ->orderBy('id', 'desc')->get()
        );
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreModelsRequest $request)
    {
        if (!$this->Checkpermistion(1)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $user = Auth()->user();

        $data= $request->validated();
        $data['idUser']=$user->id;

        $cat=Models::create($data);
        return response(new ModelsResources($cat),200);

    }

    /**
     * Display the specified resource.
     */
    public function show(Models $model)
    {
        return new ModelsResources($model);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateModelsRequest $request, Models $model)
    {
        if (!$this->Checkpermistion(2)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $user = Auth()->user();
        $data= $request->validated();
        $data['idUser']=$user->id;

        $model->update($data);
        return response(new ModelsResources($model),200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Models $model)
    {
        if (!$this->Checkpermistion(3)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        // $user = Auth()->user();
    //   $data=['isdeleted'=>true];
          $model->isdeleted=true;
            $model->update();
        return response(  "deleted",200);
    }
    public function  checkpermistion($action){

        $iditem=10;
        $userauth=Auth::user();
        $user=User::find( $userauth->id);
       return $user->checkpermistion($iditem,$action);
     }
}
