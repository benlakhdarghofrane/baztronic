<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResourceSalesOrderdetails extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

          // result of   details Sale order order form json ( lignes de bon de vente)
        return [
        'id' => $this->id,
        'idProduct'=>$this->idProduct,
        'product' =>$this->Product()->first(),
        'priceU' => $this->priceU,
        'quantity' => $this->qnt,
        'price'=> $this->price,
        'user' => $this->User()->first()->username,
        'created_at'=>$this->created_at,
    ];
    }
}
