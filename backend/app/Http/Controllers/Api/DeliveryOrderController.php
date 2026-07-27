<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DetailsDelivry;
use App\Models\DeliveryOrder;
use App\Http\Requests\StoreDeliveryOrderRequest;
use App\Http\Requests\UpdateDeliveryOrderRequest;
use App\Http\Resources\DeliveryResource;
use App\Models\statOrders;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class DeliveryOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (!$this->Checkpermistion(4)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        return DeliveryResource::collection(
            DeliveryOrder::query()->where('delivery_orders.isdeleted','false')->orderBy('id', 'desc')->paginate()
        );
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDeliveryOrderRequest $request)
    {
        if (!$this->Checkpermistion(1)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
         //
         $dataDetais=$request->details;
         $data=$request->validated();
         $user = Auth()->user();
         $data["idUser"] = $user->id;
         //$data["idDou"] = $user->idDou;
         $data["refernce"]="BDL".now()->format('Y').statOrders::query()
         ->where([["idDou",$user->idDou],["idRu",$user->idDou],["Type","2"]])->value('countT');
         $order=DeliveryOrder::create($data);
         foreach($dataDetais as $det){
             $det->idOrder=$order->id;
             $det->idUser=$user->id;
             DeliveryOrder::create($det);
         }
         return response(new DeliveryResource( $order), 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(DeliveryOrder $deliveryOrder)
    {
        return response(new DeliveryResource($deliveryOrder), 200);

    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDeliveryOrderRequest $request, DeliveryOrder $deliveryOrder)
    {
        if (!$this->Checkpermistion(2)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $dataDetais=$request->details;
        $data=$request->validated();
        $user = Auth()->user();
        $data["idUser"] = $user->id;
        //$data["idDou"] = $user->idDou;
        $data["idRu"] = $user->idRu;

        $deliveryOrder->update($data);
        foreach($dataDetais as $det){
            $det->idOrder=$deliveryOrder->id;
            $det->idUser=$user->id;
            if(!isset($det['id'])){
                DetailsDelivry::create($det);}
                else{
                    $det->save();
                }
        }
        return response(new DeliveryResource( $deliveryOrder), 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeliveryOrder $deliveryOrder)
    {
         if (!$this->Checkpermistion(3)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $user = Auth()->user();

            $deliveryOrder->isdelete=true;;
            $deliveryOrder->save();
        return response("Deleted",200);

    }
    public function  checkpermistion($action){

        $iditem=6;
        $userauth=Auth::user();
        $user=User::find( $userauth->id);
    return $user->checkpermistion($iditem,$action);
     }
}
