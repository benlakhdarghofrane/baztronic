<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DetailsreceiptController;
use App\Http\Controllers\Api\FournisseurController;
use App\Http\Controllers\Api\MarequeController;
use App\Http\Controllers\Api\MethodPaymentController;
use App\Http\Controllers\Api\ModelsController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductLotController;
use App\Http\Controllers\Api\LotController;
use App\Http\Controllers\Api\ReceiptOrderController;
use App\Http\Controllers\Api\SalesOrderController;
use App\Http\Controllers\Api\SalesOrderDetailsController;
use App\Http\Controllers\Api\DetailsPaymentController;
use App\Http\Resources\UserResource;
use App\Models\DeliveryOrder;
use App\Models\OrderForm;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::group([
    'prefix' => '',
], function () {
    Route::post('signup', [AuthController::class, 'signup']);
    // Route::post('laws', [LawsController::class, 'store']);
    Route::post('login', [AuthController::class, 'login']);
    Route::group([
        'middleware' => 'auth:sanctum',
    ], function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', function (Request $request) {
            return new UserResource($request->user());
        });


        // Route::get('/allimage', [ImageController::class, 'indexsuper']);
        //Route::get('/allroles', [UserController::class,'getItems']);
        Route::apiResource('/users', UserController::class);
        Route::apiResource('/orderForms', OrderForm::class);
        Route::apiResource('/delivryOrders', DeliveryOrder::class);
        Route::apiResource('/recieptOrders', ReceiptOrderController::class);
        Route::apiResource('/detailsreceipt', DetailsreceiptController::class);
        Route::apiResource('/detailssales', SalesOrderDetailsController::class);
        Route::apiResource('/saleOrders', SalesOrderController::class);
        Route::apiResource('/products', ProductController::class);
        Route::apiResource('/productsLot', ProductLotController::class);
        Route::apiResource('/clients', ClientController::class);
        Route::apiResource('/paymethode', MethodPaymentController::class);
        Route::apiResource('/catigories', CategoryController::class);
        Route::apiResource('/mareques', MarequeController::class);
        Route::apiResource('/lots', LotController::class);
        Route::apiResource('/models', ModelsController::class);
        Route::apiResource('/fournisseurs', FournisseurController::class);
        Route::apiResource('/images', ImageController::class);
        Route::apiResource('/docs', DocumentController::class);
        Route::apiResource('/detailsPayments', DetailsPaymentController::class);
        Route::get('/clientsFilter/{filter}/{nopag?}', [ClientController::class,'filter']);
        Route::get('/fournisseursFilter/{filter}/{nopag?}', [FournisseurController::class,'filter']);
        Route::get('/saleOrdersFilter/{filter}/{nopag?}', [SalesOrderController::class,'filter']);
        Route::get('/recieptOrdersFilter/{filter}/{nopag?}', [ReceiptOrderController::class,'filter']);
        Route::get('/detailsPaymentsbyfour/{idfour}', [DetailsPaymentController::class,'indexbyfour']);
        Route::get('/stats', [ReceiptOrderController::class,'getstat']);
        Route::get('/statsbydate/{d1?}/{d2?}', [ReceiptOrderController::class,'getstatBetweendates']);

        Route::get('/product/all', [ProductController::class, 'indexClient']);
        Route::get('/product/filter/{category?}/{mareque?}/{model?}', [ProductController::class, 'getProductbyfilter']);
        Route::get('/product/reference/{ref}', [ProductController::class, 'getProductbyref']);
        Route::get('/productSearch/{Category?}/{marque?}/{model?}/{Available}/{search?}', [ProductController::class, 'getSearchAvailableProduct']);
        Route::get('/productlot/{lot}/{marque}/{model}/{status}/{lock}/{screen}/{housing}/{charge}/{battery}/{search?}', [ProductLotController::class, 'getSearchAvailableProduct']);
        Route::get('/productSearch/{Category}/{Available}', [ProductController::class, 'getAvailableProduct']);
        Route::get('/product/barcode/{barcode}', [ProductController::class, 'getProductbybarcode']);
        Route::get('/product/mareque/{mareque}', [ProductController::class, 'getProductbymareque']);
        Route::get('/product/designation/{designation}', [ProductController::class, 'getProductbydesig']);
        Route::get('/product/price/{price}', [ProductController::class, 'getProductbyprice']);
        Route::get('/models/modelsbymareques/{idmareque}', [ModelsController::class,'Modelsbymareques']);
        Route::get('/mareques/marequesbycategory/{idcategory}', [MarequeController::class,'MarequebyCategory']);

        Route::get('test', function () {
            return response([
                "message" => 'Authenticated!'
            ], 200);
        });
    });
});

Route::get('/check-time', function () {
    return [
        'raw_now' => now(),
        'formatted' => now()->format('Y-m-d H:i:s'),
        'timezone' => now()->timezoneName,
        'offset' => now()->format('P'),
    ];
});


