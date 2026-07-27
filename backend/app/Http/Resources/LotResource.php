<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LotResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'name' => $this->name,
            'entry_date' => $this->entry_date,
            'supplier' => $this->Supplier,
            'device_type' => $this->Category,
            'quantity' => $this->Quantity,
            'device_count' => $this->device_count,
            'price' => $this->price,
            'note' => $this->note,
            'id_user' => $this->User->fullname,
            'created_at' => $this->created_at,
        ];
    }
}
