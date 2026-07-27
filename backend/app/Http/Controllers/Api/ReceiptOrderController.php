<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\ReceiptOrder;
use App\Http\Requests\StoreReceiptOrderRequest;
use App\Http\Requests\UpdateReceiptOrderRequest;
use App\Http\Resources\ReceptResource;
use App\Models\DetailsPayment;
use App\Models\Detailsreceipt;
use App\Models\Product;
use App\Models\SalesOrder;
use App\Models\statOrders;
use App\Models\User;
use Carbon\CarbonPeriod;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;

class ReceiptOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // if (!$this->Checkpermistion(4)) {
        //     return  response("You Don't Have Permission To Do on This Operation", 422);
        // }
        return ReceptResource::collection(
            ReceiptOrder::query()->orderBy('id', 'desc')->paginate()
        );
    }

    public function filter(Request $request)
    {
        if (!$this->Checkpermistion(4)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $fil = $request->filter;
        $isnopag = $request->has('nopag') ? $request->nopag : 0;
        if ($isnopag == 1)
            return ReceptResource::collection(
                ReceiptOrder::query()->where([
                    ['receipt_orders.isdeleted', 'false'],
                    ['receipt_orders.reference', 'like', '%' . $fil . '%']
                ])->orderBy('id', 'desc')->get()
            );

        return ReceptResource::collection(
            ReceiptOrder::query()->where([
                ['receipt_orders.isdeleted', 'false'], ['receipt_orders.reference', 'like', '%' . $fil . '%']
            ])
                ->orderBy('id', 'desc')->paginate()
        );
    }
public function getstat(){
    $stat=[];
    $yaer=date('Y');
    $date= $yaer.'-01-01';
    $topProduct=$this->gettopPRoductsaling();
    $statsalAll=$this->getstatBetweendates();
    $statcurrentYear=$this->getstatBetweendates($date);
    $salebytypePaiment=$this->getstatbytypePaiment();
    $newDateTime = now()->addMonth();

    $period = CarbonPeriod::create($date,'1 month', $newDateTime)->toArray();
    $statMonth=[];
    for($i=1;$i<count($period);$i++){
       $moth= date("F",strtotime($period[$i-1]));
        $statMonth[$i-1]=['Month'=>$moth,'stat'=>$this->getstatBetweendates($period[$i-1],$period[$i])];
    }

    $stat=['StatAll'=>$statsalAll,'StatYear'=> $statcurrentYear,'StatByMonth'=> $statMonth,'StatBytype'=> $salebytypePaiment,'TopProduct'=>$topProduct];
    return response($stat,200);

}



    public function getstatBetweendates($d1 = '2022-12-30', $d2 = null)
    {

        if ($d2 == null) {
            $d2 = date('Y-m-d');
        }
        $staterecpt =DB::table('receipt_orders')->selectRaw('COUNT(*) as countR,TRUNCATE(sum(priceT),2) as price,TRUNCATE(sum(payment),2) as pai,TRUNCATE(sum(rest),2) as rst')->where([
            ['receipt_orders.isdeleted', 'false'], ['receipt_orders.created_at', '>=', $d1], ['receipt_orders.created_at', '<=', $d2]
        ])->get();
        $statesale = DB::table('sales_orders')->selectRaw('count(*) as countS,TRUNCATE(sum(priceTTC),2) as price')->where([
            ['sales_orders.isdeleted', 'false'], ['sales_orders.created_at', '>=', $d1], ['sales_orders.created_at', '<=', $d2]
        ])->get();
        $arry = ['StatReciept' => $staterecpt, 'StatSale' => $statesale];
        return  $arry;
    }
    public function getstatbytypePaiment()
    {

        $statesaletyp = DB::table('sales_orders')->selectRaw('typePaiment,count(*) as countS,TRUNCATE(sum(priceTTC),2) as price')->where(
            'sales_orders.isdeleted', 'false'
        )->groupBy('typePaiment')->get();
        return $statesaletyp;
    }
    public function gettopPRoductsaling()
    {

        $stateprodect = DB::table('sales_order_details')->selectRaw('products.designationEN,sum(sales_order_details.qnt) as QntT ')
        ->join('products','sales_order_details.idProduct','products.id')-> where([
            ['sales_order_details.isdeleted', 'false'],['products.isdeleted','false']
        ])->groupBy('products.designationEN')->orderBy('QntT','desc')->limit(20)->get();
        return $stateprodect;
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReceiptOrderRequest $request)
    {
        if (!$this->Checkpermistion(1)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $data = $request->validated();
        $user = Auth()->user();
        $data["idUser"] = $user->id;
        $data["dateReceipt"] = now();
        $count = statOrders::query()
            ->where("Type", "3")->value('countT');
        $count = $count + 1;
        $count = str_pad($count, 4, '0', STR_PAD_LEFT);
        $data["reference"] = "BDR" . now()->format('Y') . $count;
        $order = ReceiptOrder::create($data);
        $detpa = [];
        $detpa["type"] = "debt";
        $detpa['amount'] = $order->rest;
        $detpa["idUser"] = $user->id;
        $detpa["idOrder"] = $order->id;
        $detpa["idFournisseur"] = $order->idFournisseur;
        $rest = 0;
        $de = DetailsPayment::query()->where([['details_payments.idFournisseur', $data["idFournisseur"]], ['details_payments.isdeleted', 'false']])->orderBy('id', 'desc')->first();
        if ($de != null) {
            $rest = $de->rest;
        }
        $detpa["rest"] = $rest + $detpa["amount"];
        $detailsPayment = DetailsPayment::create($detpa);

        return response(new ReceptResource($order), 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(ReceiptOrder $receiptOrder)
    {
        return response(new ReceptResource($receiptOrder), 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReceiptOrderRequest $request, ReceiptOrder $receiptOrder)
    {
        if (!$this->Checkpermistion(2)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $data = $request->validated();
        $user = Auth()->user();
        $data["idUser"] = $user->id;
        $data["dateReceipt"] = now();
        $receiptOrder->update($data);
        return response(new ReceptResource($receiptOrder), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReceiptOrder $receiptOrder)
    {
        if (!$this->Checkpermistion(3)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $dataDetais =  $receiptOrder->Details();
        foreach ($dataDetais as $det) {
            $stock = Product::query()->where('products->id', $det->idProduct)->first();
            if (!$stock->isEmpty()) {
                if (($stock->qnt - $det->qnt) > 0) {
                    $dataS['quantity'] = $stock->qnt - $det->qnt;
                    $stock->update($dataS);
                } else {
                }
            }
        }
        $receiptOrder->deleted = true;
        $receiptOrder->save();
        return response("deleted", 200);
    }
    public function  checkpermistion($action)
    {

        $iditem = 5;
        $userauth = Auth::user();
        $user = User::find($userauth->id);

        return $user->checkpermistion($iditem, $action);
    }
}
