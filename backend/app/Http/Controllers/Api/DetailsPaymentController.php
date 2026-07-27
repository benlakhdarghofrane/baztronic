<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DetailsPayment;
use App\Http\Requests\StoreDetailsPaymentRequest;
use App\Http\Requests\UpdateDetailsPaymentRequest;
use App\Http\Resources\DetailsPaymentResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DetailsPaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if( !$this->Checkpermistion(4)){
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        return DetailsPaymentResource::collection(
            DetailsPayment::query()->where('details_payments.isdeleted','false')->orderBy('id', 'desc')->paginate()
        );
    }

    public function indexbyfour(Request $request)
    {
        if( !$this->Checkpermistion(4)){
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $idFournisseur= $request->idfour;
        return DetailsPaymentResource::collection(
            DetailsPayment::query()->where([['details_payments.idFournisseur',$idFournisseur],['details_payments.isdeleted','false']])->orderBy('id', 'desc')->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDetailsPaymentRequest $request)
    {
        if( !$this->Checkpermistion(1)){
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $data=$request->validated();
        $user = Auth()->user();
        $data["idUser"] = $user->id;
        $rest=0;
        $deatp=DetailsPayment::query()->where([['details_payments.idFournisseur',$data["idFournisseur"]],['details_payments.isdeleted','false']])->orderBy('id', 'desc')->first();
        if($deatp!=null){
            $rest=$deatp->rest;
        }
        if($data["type"]=='debt'){
           $data["rest"]=$rest+$data["amount"];
        }elseif($rest>=$data["amount"]){
            $data["rest"]=$rest-$data["amount"];
        }else{
            return response('This price is higher than the rest.', 422);
        }

        $detailsPayment=DetailsPayment::create($data);
        return response(new DetailsPaymentResource($detailsPayment), 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(DetailsPayment $detailsPayment)
    {
        return response(new DetailsPaymentResource($detailsPayment), 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDetailsPaymentRequest $request, DetailsPayment $detailsPayment)
    {
       // $data=$request->validated();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DetailsPayment $detailsPayment)
    {
        if( !$this->Checkpermistion(3)){
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
            $detailsPayment->isdeleted=true;
            $detailsPayment->delete();
            return response('deleted', 200);
    }
    public function  checkpermistion($action)
    {
        $iditem = 5;
        $userauth = Auth::user();
        $user = User::find($userauth->id);
        return $user->checkpermistion($iditem, $action);
    }
}
