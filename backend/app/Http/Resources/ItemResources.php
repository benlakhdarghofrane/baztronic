<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResources extends JsonResource
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
            'nameAR' => $this->nameAR,
            'nameEN' => $this->nameEN,
            'nameFR' => $this->nameFR,
        ];
    }
}
