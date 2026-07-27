<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalesOrder;
use App\Http\Requests\StoreSalesOrderRequest;
use App\Http\Requests\UpdateSalesOrderRequest;
use App\Http\Resources\ResourceSalesOrder;
use App\Models\Product;
use App\Models\SalesOrderDetails;
use App\Models\statOrders;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SalesOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if( !$this->Checkpermistion(4)){
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        return ResourceSalesOrder::collection(
            SalesOrder::query()->where('sales_orders.isdeleted','false')->orderBy('id', 'desc')->paginate()
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
        return ResourceSalesOrder::collection(
            SalesOrder::query()->with('client')
        ->where('sales_orders.isdeleted', 'false')
        ->where(function ($query) use ($fil) {
            $query->where('sales_orders.reference', 'like', "%{$fil}%")
                  ->orWhereHas('client', function ($q) use ($fil) {
                      $q->where('fullname', 'like', "%{$fil}%")
                      ->orWhere('phone', 'like', "%{$fil}%");
                  });
        })
        ->orderBy('id', 'desc')
        ->get()
        );

        return ResourceSalesOrder::collection(
            SalesOrder::query()->with('client')
        ->where('sales_orders.isdeleted', 'false')
        ->where(function ($query) use ($fil) {
            $query->where('sales_orders.reference', 'like', "%{$fil}%")
                  ->orWhereHas('client', function ($q) use ($fil) {
                      $q->where('fullname', 'like', "%{$fil}%")
                      ->orWhere('phone', 'like', "%{$fil}%");
                  });
        })
        ->orderBy('id', 'desc')->paginate()
        );

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSalesOrderRequest $request)
    {
        if (!$this->Checkpermistion(1)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }

        $data = $request->validated();
        $user = Auth()->user();
        $data["idUser"] = $user->id;
        $data["dateOrder"] = now();
        $count=statOrders::query()
        ->where("Type", "4")->value('countT');
        $count= $count+1;
        $count=str_pad($count, 4, '0', STR_PAD_LEFT);
        $data["reference"] = "BDV" . now()->format('Y') .$count;
        $order = SalesOrder::create($data);
        return response(new ResourceSalesOrder($order), 200);
    }
    /**
     * Display the specified resource.
     */
    public function show(SalesOrder $salesOrder)
    {
        return response(new ResourceSalesOrder($salesOrder), 200);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSalesOrderRequest $request, SalesOrder $salesOrder)
    {
        if (!$this->Checkpermistion(2)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $dataDetais = $request->details;
        $data = $request->validated();
        $user = Auth()->user();
        $data["idUser"] = $user->id;
        $salesOrder->update($data);
        foreach ($dataDetais as $det) {
            $det->idreceipt = $salesOrder->id;
            $det->idUser = $user->id;
            if (!isset($det['id'])) {
                SalesOrderDetails::create($det);
                $stock = Product::query()->where('products->id', $det->idProduct)->first();
                if ($stock->isEmpty()) {
                } else {
                    if($stock->qnt>$det['qnt']){
                    $dataS['quantity'] =$stock->qnt- $det['qnt'] ;
                    $stock->update($dataS);}
                }
            } else {
                $det->save();
            }
        }
        return response(new ResourceSalesOrder($salesOrder), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SalesOrder $salesOrder)
    {
        if (!$this->Checkpermistion(3)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $dataDetais =  $salesOrder->Details();
        foreach ($dataDetais as $det) {
            $stock = Product::query()->where('products->id', $det->idProduct)->first();
            if (!$stock->isEmpty()) {
                    $dataS['quantity'] = $stock->qnt + $det->qnt;
                    $stock->update($dataS);
                }
        }
        $salesOrder->deleted = true;
        $salesOrder->save();
        return response("deleted", 200);
    }
    public function  checkpermistion($action)
    {

        $iditem = 6;
        $userauth = Auth::user();
        $user = User::find($userauth->id);

        return $user->checkpermistion($iditem, $action);
    }
}
