<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Fournisseur;
use App\Http\Requests\StoreFournisseurRequest;
use App\Http\Requests\UpdateFournisseurRequest;
use App\Http\Resources\ResourceFournisseur;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FournisseurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (!$this->Checkpermistion(4)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        return ResourceFournisseur::collection(
            Fournisseur::query()->where('fournisseurs.isdeleted','false')->orderBy('id', 'desc')->paginate()
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
        return ResourceFournisseur::collection(
            Fournisseur::query()->where([['fournisseurs.isdeleted','false'],['fournisseurs.fullname', 'like', '%' . $fil . '%']])->orWhere([['fournisseurs.isdeleted','false'],['fournisseurs.phone', 'like', '%' . $fil . '%']]) ->orderBy('id', 'desc')->get()
        );

        return ResourceFournisseur::collection(
            Fournisseur::query()->where([['fournisseurs.isdeleted','false'],['fournisseurs.fullname', 'like', '%' . $fil . '%']])->orWhere([['fournisseurs.isdeleted','false'],['fournisseurs.phone', 'like', '%' . $fil . '%']]) ->orderBy('id', 'desc')->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFournisseurRequest $request)
    {
        if (!$this->Checkpermistion(1)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $user = Auth()->user();
        $data= $request->validated();
        $data['idUser']=$user->id;

        $cat=Fournisseur::create($data);
        return response(new ResourceFournisseur($cat),200);

    }

    /**
     * Display the specified resource.
     */
    public function show(Fournisseur $fournisseur)
    {
        return response(new ResourceFournisseur( $fournisseur),200);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFournisseurRequest $request, Fournisseur $fournisseur)
    {
        if (!$this->Checkpermistion(2)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $user = Auth()->user();
        $data= $request->validated();
        $data['idUser']=$user->id;
        $fournisseur->update($data);
        return response(new ResourceFournisseur( $fournisseur),200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Fournisseur $fournisseur)
    {
        if (!$this->Checkpermistion(3)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }

            $fournisseur->isdeleted=true;
            $fournisseur->update();
            return response('deleted',200);
    }
    public function  checkpermistion($action){
        $iditem=7;
        $userauth=Auth::user();
        $user=User::find( $userauth->id);
    return $user->checkpermistion($iditem,$action);
     }
}
