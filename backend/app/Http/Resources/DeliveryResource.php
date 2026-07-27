<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeliveryResource extends JsonResource
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
            'reference' => $this->reference,
            'dateDelivery' => $this->dateDelivery,
            'status' => $this->status,
            'priceT' => $this->priceT,
            'Fournisseur'=> $this->Fournisseur(),
              'User' => $this->User()->username,
            'created_at'=>$this->created_at,
        ];
    }
}
