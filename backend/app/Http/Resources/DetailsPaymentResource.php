<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DetailsPaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $order= $this->Order()->first();
          return [
            'id' => $this->id,
            'type' => $this->type,
            'amount' => $this->amount,
            'rest' => $this->rest,
            'Fournisseur'=> $this->Fournisseur()->first()->fullname,
            'reference'=> $order!=null?$order->reference:'',
            'User' => $this->User()->first()->username,
            'created_at'=>$this->created_at,
        ];
    }
}
