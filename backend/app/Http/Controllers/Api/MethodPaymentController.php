<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MethodPayment;
use App\Http\Requests\StoreMethodPaymentRequest;
use App\Http\Requests\UpdateMethodPaymentRequest;
use App\Http\Resources\ResourceMethodPayment;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class MethodPaymentController extends Controller
{

    public function index()
    {
        if (!$this->Checkpermistion(4)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        return ResourceMethodPayment::collection(
            MethodPayment::query()->where('method_payments.isdeleted','false') ->orderBy('id', 'desc')->get()
        );
    }
    public function indexClient()
    {
        return ResourceMethodPayment::collection(
            MethodPayment::query()->where('method_payments.isdeleted','false') ->orderBy('id', 'desc')->get()
        );   }
    public function store(StoreMethodPaymentRequest $request)
    {
        if (!$this->Checkpermistion(1)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $user = Auth()->user();
        $data= $request->validated();
        $data['idUser']=$user->id;
        $cat=MethodPayment::create($data);
        return response(new ResourceMethodPayment($cat),200);
    }

    /**
     * Display the specified resource.
     */
    public function show(MethodPayment $methodPayment)
    {
        return new ResourceMethodPayment( $methodPayment);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMethodPaymentRequest $request, MethodPayment $methodPayment)
    {
        if (!$this->Checkpermistion(2)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $user = Auth()->user();
        $data= $request->validated();
        $data['idUser']=$user->id;
         $methodPayment->update($data);
        return response(new ResourceMethodPayment( $methodPayment),200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MethodPayment $methodPayment)
    {
        if (!$this->Checkpermistion(3)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        // $user = Auth()->user();
     //   $data=['isdeleted'=>true];
           $methodPayment->isdeleted=true;
             $methodPayment->update();

        return response(   $methodPayment,200);
    }

    public function  checkpermistion($action){

        $iditem=9;
        $userauth=Auth::user();
        $user=User::find( $userauth->id);
       return $user->checkpermistion($iditem,$action);
     }
}
