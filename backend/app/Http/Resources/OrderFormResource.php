<?php

namespace App\Http\Resources;

use App\Models\OrderformDetails;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderFormResource extends JsonResource
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
            'dateOrder' => $this->dateOrder,
            'status' => $this->status,
            'priceT' => $this->priceT,
            'DetailsOrder'=> new OrderFormDetailsResource($this->DetailsOrdeforn()),
             'User' => $this->User()->username,
            'created_at'=>$this->created_at,
        ];
    }
}
