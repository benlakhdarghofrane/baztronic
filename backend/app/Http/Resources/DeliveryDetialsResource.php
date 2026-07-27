<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeliveryDetialsResource extends JsonResource
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
            'product' =>['designationAR'=>$this->Product()->first('products.designationAR'),
            'designationEN'=>$this->Product()->first('products.designationEN'),
            'designationFR'=>$this->Product()->first('products.designationFR')],
            'priceU' => $this->priceU,
            'quantity' => $this->qnt,
            'unit' => $this->unit,
            'price'=> $this->price,
            'user' => $this->User()->username,
            'created_at'=>$this->created_at,
        ];
    }
}
