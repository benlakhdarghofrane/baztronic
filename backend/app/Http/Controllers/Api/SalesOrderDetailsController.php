<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalesOrderDetails;
use App\Http\Requests\StoreSalesOrderDetailsRequest;
use App\Http\Requests\UpdateSalesOrderDetailsRequest;
use App\Http\Resources\ResourceSalesOrderdetails;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SalesOrderDetailsController extends Controller
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
        return ResourceSalesOrderdetails::collection(
            SalesOrderDetails::query()->where('sales_order_details.idsale',$id)->orderBy('id', 'desc')->get()
        );
        //
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSalesOrderDetailsRequest $request)
    {
        if( !$this->Checkpermistion(1)){
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $det = $request->validated();
        $user = Auth()->user();
        $det["idUser"] = $user->id;
        $stock = Product::query()->where('products.id', $det['idProduct'])->first();
        if ($stock!=null) {
            if ($stock->quantity >= $det['qnt']) {
                $dataS['quantity'] = $stock->quantity - $det['qnt'];
                $dataS['sale_price']=$det["priceU"] ;
                $datasl=SalesOrderDetails::create($det);
                $stock->update($dataS);
                return response(new ResourceSalesOrderdetails( $datasl), 200);
            }
            return response('insufficient quantity of product :'.$stock->reference, 422);
        }
        return response('product does not exist', 422);
    }

    /**
     * Display the specified resource.
     */
    public function show(SalesOrderDetails $detailssale)
    {
        return response(new ResourceSalesOrderdetails( $detailssale), 200);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSalesOrderDetailsRequest $request, SalesOrderDetails $salesOrderDetails)
    {

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SalesOrderDetails $detailssale)
    {
        if( !$this->Checkpermistion(3)){
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }

        $stock = Product::query()->where('products.id', $detailssale->idProduct)->first();
        if (!$stock->isEmpty()) {
                $dataS['quantity'] = $stock->qnt + $detailssale->qnt;
                $stock->update($dataS);
            }
            $detailssale->delete();
            return response('deleted', 200);
    }
    public function  checkpermistion($action)
    {

        $iditem = 6;
        $userauth = Auth::user();
        $user = User::find($userauth->id);

        return $user->checkpermistion($iditem, $action);
    }
}
