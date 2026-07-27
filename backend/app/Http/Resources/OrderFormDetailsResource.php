<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderFormDetailsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'idProduct'=>$this->idProduct,
            'product' =>['designationAR'=>$this->product()->first('products.designationAR'),
                        'designationEN'=>$this->product()->first('products.designationEN'),
                        'designationFR'=>$this->product()->first('products.designationFR')],
            'priceU' => $this->priceU,
            'quantity' => $this->qnt,
            'unit' => $this->unit,
            'price'=> $this->price,
            'user' => $this->User()->fullname,
            'created_at'=>$this->created_at,
        ];
    }
}
