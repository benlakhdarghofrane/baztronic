<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReceptDetailsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // lines or details of Order Receipt ( lignes bon d'achat )
        return [
            'id' => $this->id,
            'idProduct'=>$this->idProduct,
            'product' =>$this->Product()->first('products.designationEN'),
            'priceU' => $this->priceU,
            'quantity' => $this->qnt,
            'priceHT'=>$this->priceHT,
            'taxes'=>$this->taxes,
            'extraExpenes'=>$this->extraExpenes,
            'priceT'=>$this->priceT,
            'description'=>$this->description,
            'user' => $this->User()->first()->username,
            'created_at'=>$this->created_at,
        ];
    }
}
