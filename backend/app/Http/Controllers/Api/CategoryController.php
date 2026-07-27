<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryPResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // if (!$this->Checkpermistion(4)) {
        //     return  response("You Don't Have Permission To Do on This Operation", 422);
        // }
        return CategoryPResource::collection(
            Category::query()->where('categories.isdeleted','false') ->orderBy('id', 'desc')->paginate()
        );
        return CategoryPResource::collection(Category::query()->where('categories.isdeleted', 'false')
            ->with('products')
            ->orderBy('id', 'desc')
            ->paginate()
    );
    }
    public function indexClient()
    {
        return CategoryPResource::collection(
            Category::query()->where('categoris.isdeleted','false') ->orderBy('id', 'desc')->get());
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {

        if (!$this->Checkpermistion(1)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $user = Auth()->user();

        $data= $request->validated();
        $data['idUser']=$user->id;
        if(!isset( $data['designationAR'])){
            $data['designationAR']= $data['designationEN'];
        } if(!isset( $data['designationFR'])){
            $data['designationFR']= $data['designationEN'];
        }
        $cat=Category::create($data);
        return response(new CategoryPResource($cat),200);

    }

    /**
     * Display the specified resource.
     */
    public function show(Category $catigory)
    {
        return new CategoryPResource($catigory);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $catigory)
    {
        if (!$this->Checkpermistion(2)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $user = Auth()->user();
        $data= $request->validated();
        $data['idUser']=$user->id;
        if(!isset( $data['designationAR'])){
            $data['designationAR']= $data['designationEN'];
        } if(!isset( $data['designationFR'])){
            $data['designationFR']= $data['designationEN'];
        }
        $catigory->update($data);
        return response(new CategoryPResource($catigory),200);


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $catigory)
    {
        if (!$this->Checkpermistion(3)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        // $user = Auth()->user();
     //   $data=['isdeleted'=>true];
          $catigory->isdeleted=true;
            $catigory->update();

        return response(  "deleted",200);
    }

    public function  checkpermistion($action){

        $iditem=3;
        $userauth=Auth::user();
        $user=User::find( $userauth->id);
       return $user->checkpermistion($iditem,$action);
     }
}

