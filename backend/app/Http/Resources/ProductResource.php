<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

use function PHPUnit\Framework\isEmpty;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $image=$this->images()->get();
        $model=$this->Models()->first();
        $mareqe=$this->Mareque()->first();
        $Category=$this->Categorie()->first();

        return [
            'id' => $this->id,
            'category'=>$Category!=null?['id'=>$Category->id,'name'=>$Category->designationEN]:[],
            'mareque'=>$mareqe!=null?['id'=>$mareqe->id,'name'=>$mareqe->name]:[],
            'model' =>$model!=null?['id'=>$model->id,'name'=>$model->name]:[],
            'refernce' => $this->refernce,
            'barcode' => $this->barcode,
            'imei'=>$this->imei,
            'serial_number' => $this->serial_number,
            'color' => $this->color,
         //   'designationAR' => $this->designationAR,
            'designationEN' => $this->designationEN,
          //  'designationFR' => $this->designationFR,
            'description'=>$this->description,
            'purchasePrice'=>$this->purchase_price,
            'salePrice'=>$this->sale_price,
            'quantity'=>$this->quantity,
            'max_quantity'=>$this->max_quantity,
            'min_quantity'=>$this->min_quantity,
            'processeur'=>$this->processeur,
            'ram'=>$this->ram,
            'stokage'=>$this->stokage,
            'screen'=>$this->screen,
            'carteGraphique'=>$this->carteGraphique,
            'battery'=>$this->battery,
            'Status'=>$this->status,
            'idFournisseur'=>$this->idFournisseur,
            'images'=> $image->isEmpty()?'': ImageResource::collection($image),
            'created_at'=>$this->created_at,
            'initQnt'=>$this->initQnt!=null?$this->initQnt:$this->quantity,
            'finalQnt'=>$this->finalQnt!=null?$this->finalQnt:$this->quantity,
        ];
    }
    // result of  product form json if client


}
