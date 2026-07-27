<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResourceSalesOrder extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // result of  Sale order order form json (bon de vente)
        $dest=$this->Details()->get();

        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'dateOrder' => $this->dateOrder,
            'status' => $this->status,
            'typePaiment'=> $this->typePaiment,
            'paid'=>$this->paid,
            'enable_taxes'=>$this->enable_taxes,
            'priceHT'=> $this->priceHT,
            'taxes'=> $this->taxes,
            'priceTTC'=> $this->priceTTC,
            'DetailsOrder'=>$dest->isEmpty()?[]: ResourceSalesOrderdetails::collection($dest), // list  lines  of  sale order
            'Client'=>$this->Client()->first(),
            'guarantee'=>$this->guarantee,
            'User' => $this->User()->first()->username,
            'created_at'=>$this->created_at,
        ];
    }
}
