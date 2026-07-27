<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReceptResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
         // result of  reciept order form json (bon d'achte)
         $dest=$this->Detailsreceipts()->get();

        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'dateReceipt' => $this->dateReceipt,
            'status' => $this->status,
            'priceT' => $this->priceT,
            'payment' => $this->payment,
            'rest' => $this->rest,
            'DetailsOrder'=>$dest->isEmpty()?[]: ReceptDetailsResource::collection( $dest), // list  lines  of  reciept order
            'Fournisseur'=>$this->Fournisseur()->first(),
            'User' => $this->User()->first()->username,
            'created_at'=>$this->created_at,];

    }
}
