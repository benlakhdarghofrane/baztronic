<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDetailsreceiptRequest;
use App\Http\Requests\UpdateDetailsreceiptRequest;
use App\Http\Resources\ReceptDetailsResource;
use App\Models\Detailsreceipt;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DetailsreceiptController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if( !$this->Checkpermistion(4)){
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $id=$request->idOrder;
        return ReceptDetailsResource::collection(
            Detailsreceipt::query()->where('detailsreceipts.idreceipt',$id)->orderBy('id', 'desc')->get()
        );
        //
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDetailsreceiptRequest $request)
    {
        if( !$this->Checkpermistion(1)){
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $det = $request->validated();
        if(!isset($det['description'])){
            $det['description']="";
        }
        $user = Auth()->user();
        $det["idUser"] = $user->id;
        $stock = Product::query()->where('products.id',$det['idProduct'] )->first();
        if ($stock!=null) {
        //if (!$stock->isEmpty()) {
                $dataS['quantity'] = $stock->quantity + $det['qnt'];
                $dataS['purchase_price'] =  $det['priceU'];
                $data=Detailsreceipt::create($det);
                $stock->update($dataS);
                return response(new ReceptDetailsResource( $data), 200);

        //}
    }
        return response('product does not exist', 422);
    }

    /**
     * Display the specified resource.
     */
    public function show(Detailsreceipt $detailsreceipt)
    {
        return response(new ReceptDetailsResource( $detailsreceipt), 200);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDetailsreceiptRequest $request, Detailsreceipt $Detailsreceipt)
    {

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Detailsreceipt $detailsreceipt)
    {
        if( !$this->Checkpermistion(3)){
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }

        $stock = Product::query()->where('products.id', $detailsreceipt->idProduct)->first();
        if (!$stock->isEmpty()) {
                $dataS['quantity'] = $stock->qnt - $detailsreceipt->qnt;
                $stock->update($dataS);
            }
            $detailsreceipt->delete();
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
