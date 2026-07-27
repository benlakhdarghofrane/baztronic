<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\OrderForm;
use App\Http\Requests\StoreOrderFormRequest;
use App\Http\Requests\UpdateOrderFormRequest;
use App\Http\Resources\OrderFormResource;
use App\Models\OrderformDetails;
use App\Models\statOrders;

class OrderFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return OrderFormResource::collection(
            OrderForm::query()->orderBy('id', 'desc')->paginate()
        );

    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderFormRequest $request)
    {
        //
        $dataDetais=$request->details;
        $data=$request->validated();
        $user = Auth()->user();
        $data["idUser"] = $user->id;
        //$data["idDou"] = $user->idDou;
        $data["idRu"] = $user->idRu;

        $data["refernce"]="CMD".now()->format('Y').statOrders::query()
        ->where([["idDou",$user->idDou],["idRu",$user->idDou],["Type","1"]])->value('countT');

        $order=OrderForm::create($data);
        foreach($dataDetais as $det){
            $det->idOrder=$order->id;
            $det->idUser=$user->id;
            OrderformDetails::create($det);
        }
        return response(new OrderFormResource( $order), 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(OrderForm $orderForm)
    {
        return response(new OrderFormResource($orderForm), 200);

    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderFormRequest $request, OrderForm $orderForm)
    {
        $dataDetais=$request->details;
        $data=$request->validated();
        $user = Auth()->user();
        $data["idUser"] = $user->id;

        $orderForm->update($data);
        foreach($dataDetais as $det){
            $det->idOrder=$orderForm->id;
            $det->idUser=$user->id;
            if(!isset($det['id'])){
                OrderformDetails::create($det);}
                else{
                    $det->save();
                }
        }
        return response(new OrderFormResource( $orderForm), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrderForm $orderForm)
    {
        $dataDetais=$orderForm->DetailsOrdeforn()->get();
        foreach($dataDetais as $det){
           $det->delete();
        }
        $orderForm->delete();
        return response("Deleted", 200);
    }


}
