<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Product;
use App\Models\ProductLot;
use App\Http\Requests\StoreProductLotRequest;
use App\Http\Requests\UpdateProductLotRequest;
use App\Http\Resources\ProductLotResource;
use App\Models\Lot;
use App\Models\statOrders;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use function PHPUnit\Framework\isEmpty;

class ProductLotController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // if (!$this->Checkpermistion(1)) {
        //     return  response("You Don't Have Permission To Do on This Operation", 422);
        // }
       $user =Auth::user();


        return ProductLotResource::collection(
            ProductLot::selectRaw('products.*,tabr.qntTR as initQnt , tabs.qntT as finalQnt ')
        ->join(DB::raw(' (select idProduct, sum(qnt)  qntTR from detailsreceipts group by idProduct)   tabr '), function($join)
        {
           $join->on('products.id', '=', 'tabr.idProduct');
        })
            ->join(DB::raw(' (select idProduct, sum(qnt)  qntT from sales_order_details group by idProduct)   tabs '), function($join)
            {
               $join->on('products.id', '=', 'tabs.idProduct');
            })
            ->where(['products.isdeleted', 'false'])->groupby('products.id') ->orderBy('id', 'desc')->paginate()
        );
    }


    public function getProductbyfilter(Request $request)
    {
        $lot = $request->lot;
        return ProductLotResource::collection(
            ProductLot::query()->where([['products.isdeleted', 'false'], ['products.model', $model], ['products.status', 'published']])->orderBy('id', 'desc')->paginate()
        );
    }

    public function getProductbybarcode($barcode)
    {
    return ProductLotResource::collection(
            ProductLot::query()->where([['products.isdeleted', 'false'], ['products.barcode', 'like', $barcode], ['products.status', 'published']])->orderBy('id', 'desc')->get()
        );
    }
    public function getSearchAvailableProduct(Request $request)
    {
        $lot = $request->lot;
        $search = $request->search;
        $marque = $request->marque;
        $model = $request->model;;
        $status = $request->status;
        $lock=$request->lock;
        $screen=$request->screen;
        $housing=$request->housing;
        $charge=$request->charge;
        $battery=$request->battery;
        $querry=ProductLot::query()->with('Lot')->where('products_lot.isdeleted', 'false');
        if($lot!=='null'){
        $querry=$querry->where('products_lot.id_lot', $lot);
        }
       if ($marque != 0) {
        $querry->where('marque', $marque);
    }

    if ($model != 0) {
        $querry->where('model', $model);
    }

    if ($status != 'all') {
        $querry->where('status', $status);
    }
     if ($lock != 'all') {
        $querry->where('lock_status', $lock);
    }
    if ($screen != 'all') {
        $querry->where('screen_state', $screen);
    }
    if ($housing != 'all') {
        $querry->where('housing_state', $housing);
    }
    if ($charge != 'all') {
        $querry->where('charge_state', $charge);
    }
    if ($battery != 'all') {
        $querry->where('battrystate', $battery);
    }
    return ProductLotResource::collection(
        $querry=$querry
        ->where(function ($query) use ($search) {
            $query->where('products_lot.barcode', 'like', "%$search%")
                  ->orWhere('products_lot.designationEN', 'like', "%$search%")
                  ->orWhereHas('Lot', function ($q) use ($search) {
                      $q->where('name', 'like', "%$search%");
                  });
        })
        ->orderBy('id', 'desc')->paginate(16)
);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductLotRequest $request)
    {
        if (!$this->Checkpermistion(1)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $user = Auth()->user();
        $idimage = [];
        if (isset($request['idimgs'])) {
            $idimage = $request->idimgs;
        }

        $data = $request->validated();
        $data['idUser'] = 1; //$user->id;
        if (!isset($data['status'])) {
            $data['status'] = 'published';
        }
        $data['idUser'] = 1; // $user->id;
        if (!isset($data['barcode'])) {
            $lot_reference = Lot::query()
                ->where("id", $data['id_lot'])->value('reference');
            $count = statOrders::query()
                ->where("Type", "7")->value('countT');
            $count = $count + 1;
            $count = str_pad($count, 3, '0', STR_PAD_LEFT);
            $data['reference'] = 'BZ'.substr($lot_reference, 3).'-'. $count;
            $data['barcode'] = 'BZ'.substr($lot_reference, 3).'-'. $count;
        }
        if (!isset($data['designationAR'])) {
            $data['designationAR'] = $data['designationEN'];
        }
        if (!isset($data['designationFR'])) {
            $data['designationFR'] = $data['designationEN'];
        }
        $cat = ProductLot::create($data);
        if (!empty($idimage)) {
            $cat->images()->attach($idimage, ['idUser' => $data['idUser']]);
        }
        Lot::where('id', $data['id_lot'])
        ->increment('device_count', 1);
        return response(new ProductLotResource($cat), 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductLot $product)
    {
        return response(new ProductLotResource($product), 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductLotRequest $request, ProductLot $productsLot)
    {
        if (!$this->Checkpermistion(2)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $idimgs = [];
        if (isset($request['idimgs'])) {
            $idimgs = $request->idimgs;
        }
        $user = Auth()->user();
        $data = $request->validated();
        $data['idUser'] = $user->id;
        $oldStatus = $productsLot->status;
        $productsLot->update($data);
        if (!empty($idimgs)) {
            $productsLot->images()->attach($idimgs, ['idUser' => $data['idUser']]);
        }
         $existingProduct = Product::where('barcode', $productsLot->barcode)
        ->first();

       if ($productsLot->status === "Ready For sell") {
    if ($existingProduct) {
       if ($existingProduct->quantity > 0) {
            $existingProduct->designationEN = $productsLot->designationEN;
            $existingProduct->designationAR = $productsLot->designationAR;
            $existingProduct->designationFR = $productsLot->designationFR;

            $existingProduct->mareque = $productsLot->marque;
            $existingProduct->model = $productsLot->model;
            $existingProduct->imei = $productsLot->imei;
            $existingProduct->serial_number = $productsLot->serial_number;
            $existingProduct->color = $productsLot->color;

            $existingProduct->quantity = 1;
            $existingProduct->purchase_price = $productsLot->purchase_price;
            $existingProduct->sale_price = $productsLot->sale_price;

            $existingProduct->description = $productsLot->description;
            $existingProduct->ram = $productsLot->ram;
            $existingProduct->processeur = $productsLot->processeur;
            $existingProduct->stokage = $productsLot->stokage;
            $existingProduct->screen = $productsLot->screen;
            $existingProduct->battery = $productsLot->battery;
            $existingProduct->carteGraphique = $productsLot->carteGraphique;

            $existingProduct->status = 'published';
            $existingProduct->idUser = $user->id;
            $existingProduct->isdeleted = false;
            $existingProduct->id_productlot = $productsLot->id;
            $existingProduct->save();
        }
    } else {

        Product::create([
            'refernce'        => $productsLot->reference,
            'barcode'         => $productsLot->barcode,
            'idcategory'      => $productsLot->lot->device_type,
            'designationEN'   => $productsLot->designationEN,
            'designationAR'   => $productsLot->designationAR,
            'designationFR'   => $productsLot->designationFR,

            'imei'           => $productsLot->imei,
            'serial_number'   => $productsLot->serial_number,
            'color'           => $productsLot->color,

            'mareque'         => $productsLot->marque,
            'model'           => $productsLot->model,

            'quantity'        => 1,
            'purchase_price'  => $productsLot->purchase_price,
            'sale_price'      => $productsLot->sale_price,

            'description'     => $productsLot->description,
            'ram'             => $productsLot->ram,
            'processeur'      => $productsLot->processeur,
            'stokage'         => $productsLot->stokage,
            'screen'          => $productsLot->screen,
            'battery'         => $productsLot->battery,
            'carteGraphique'  => $productsLot->carteGraphique,

            'status'          => 'published',
            'idUser'          => $user->id,
            'id_productlot'   => $productsLot->id,
        ]);
    }
        }else{
            if ($existingProduct) {
                $existingProduct->isdeleted = true;
                $existingProduct->save();
            }
        }
        return response(new ProductLotResource($productsLot), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductLot $productsLot)
    {
        if (!$this->Checkpermistion(3)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }

      $productsLot->update([
      'isdeleted' => true
       ]);
       Lot::where('id', $productsLot->id_lot)
        ->decrement('device_count', 1);
        return response(  'deleted',200);
    }

    public function  checkpermistion($action)
    {

        $iditem = 12;
        $userauth = Auth::user();
        $user = User::find($userauth->id);
        return $user->checkpermistion($iditem, $action);
    }
}
