<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\statOrders;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use function PHPUnit\Framework\isEmpty;

class ProductController extends Controller
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

       if( $user->idFournisseur==0)
        return ProductResource::collection(
            Product::query()->where('products.isdeleted', 'false')->orderBy('id', 'desc')->paginate()
        );
        return ProductResource::collection(
            Product::selectRaw('products.*,tabr.qntTR as initQnt , tabs.qntT as finalQnt ')
        //   ->join('receipt_orders','receipt_orders.idFournisseur','products.idFournisseur')
        ->join(DB::raw(' (select idProduct, sum(qnt)  qntTR from detailsreceipts group by idProduct)   tabr '), function($join)
        {
           $join->on('products.id', '=', 'tabr.idProduct');
        })
            ->join(DB::raw(' (select idProduct, sum(qnt)  qntT from sales_order_details group by idProduct)   tabs '), function($join)
            {
               $join->on('products.id', '=', 'tabs.idProduct');
            })
            ->where([['products.isdeleted', 'false'],['products.idFournisseur',$user->idFournisseur]])->groupby('products.id') ->orderBy('id', 'desc')->paginate()
        );
    }

    public function indexClient()
    {
        return ProductResource::collection(
            Product::query()->where([['products.isdeleted', 'false'], ['products.status', 'published']])->orderBy('id', 'desc')->paginate()
        );
    }
    public function getProductbyfilter(Request $request)
    {
        $cat = $request->category;
        $marq = $request->mareque;
        $model = $request->model;
        return ProductResource::collection(
            Product::query()->where([['products.isdeleted', 'false'], ['products.model', $model], ['products.status', 'published']])->orderBy('id', 'desc')->paginate()
        );
    }
    public function getProductbyref(Request $request)
    {
        $cat = $request->ref . '%';
        return ProductResource::collection(
            Product::query()->where([['products.isdeleted', 'false'], ['products.reefernce', 'like', $cat], ['products.status', 'published']])->orderBy('id', 'desc')->get()
        );
    }
    public function getProductbybarcode($barcode)
    {
    return ProductResource::collection(
            Product::query()->where([['products.isdeleted', 'false'], ['products.barcode', 'like', $barcode], ['products.status', 'published']])->orderBy('id', 'desc')->get()
        );
    }
    public function getSearchAvailableProduct(Request $request)
    {
        $category = $request->Category;
        $marque = $request->marque;
        $model = $request->model;
        $search = $request->search;
        $Available = $request->Available;
        $querry=Product::query()->with('Categorie')->where([['products.isdeleted', 'false'], ['products.status', 'published']]);
        if($category!=='null'){
        $querry=$querry->where('products.idcategory', $category);
        }
        if($marque!=='null'){
            $querry=$querry->where('products.mareque', $marque);
        }
        if($model!=='null'){
            $querry=$querry->where('products.model', $model);
        }
        if($Available=='Available'){
        $querry=$querry->wherenot('products.quantity', 0);
        }elseif($Available=='Unavailable'){
        $querry=$querry->where('products.quantity', 0);
        }
        return ProductResource::collection(
        $querry=$querry
        ->where(function ($query) use ($search) {
            $query->where('products.barcode', 'like', "%$search%")
                  ->orWhere('products.designationEN', 'like', "%$search%")
                  ->orWhereHas('Categorie', function ($q) use ($search) {
                      $q->where('designationEN', 'like', "%$search%");
                  });
        })
        ->orderBy('id', 'desc')->paginate()
);
    }
        public function getAvailableProduct(Request $request)
    {
        $Available = $request->Available;
        $querry=Product::query()->with('Categorie')->with('Categorie')->where([['products.isdeleted', 'false'], ['products.status', 'published']]);
        if($Available=='Available'){
        $querry=$querry->wherenot('products.quantity', 0);
        }elseif($Available=='Unavailable'){
        $querry=$querry->where('products.quantity', 0);
        }else{
            $querry=Product::query();
        }
        return ProductResource::collection(
        $querry=$querry->orderBy('id', 'desc')->paginate()
);
    }
    public function getProductbymareque(Request $request)
    {
        $cat = $request->mareque . '%';
        return ProductResource::collection(
            Product::query()->where([['products.isdeleted', 'false'], ['products.mareque', 'like', $cat], ['products.status', 'published']])->orderBy('id', 'desc')->paginate()
        );
    }
    public function getProductbydesig(Request $request)
    {
        $cat = $request->designation . '%';
        return ProductResource::collection(
            Product::query()->where([['products.isdeleted', 'false'], ['products.designationEN', 'like', $cat], ['products.status', 'published']])->orderBy('id', 'desc')->paginate()
        );
    }
    public function getProductbyprice(Request $request)
    {
        $cat = $request->price;
        return ProductResource::collection(
            Product::query()->where([['products.isdeleted', 'false'], ['products.designationEN', '<=', $cat], ['products.status', 'published']])->orderBy('id', 'desc')->paginate()
        );
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
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
            $count = statOrders::query()
                ->where("Type", "5")->value('countT');
            $count = $count + 1;
            $count = str_pad($count, 5, '0', STR_PAD_LEFT);
            $data['barcode'] = now()->format('Y') . statOrders::query()
                ->where("Type", "5")->value('countT');
        }
        if (!isset($data['designationAR'])) {
            $data['designationAR'] = $data['designationEN'];
        }
        if (!isset($data['designationFR'])) {
            $data['designationFR'] = $data['designationEN'];
        }
        $cat = Product::create($data);
        if (!empty($idimage)) {
            $cat->images()->attach($idimage, ['idUser' => $data['idUser']]);
        }

        return response(new ProductResource($cat), 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response(new ProductResource($product), 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
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
        $product->update($data);
        if (!empty($idimage)) {
            $product->images()->attach($idimage, ['idUser' => $data['idUser']]);
        }

        return response(new ProductResource($product), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        if (!$this->Checkpermistion(3)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }

        $product->isdeleted = true;
        $product->save();
        return response(new ProductResource($product), 200);
    }

    public function  checkpermistion($action)
    {

        $iditem = 4;
        $userauth = Auth::user();
        $user = User::find($userauth->id);
        return $user->checkpermistion($iditem, $action);
    }
}
