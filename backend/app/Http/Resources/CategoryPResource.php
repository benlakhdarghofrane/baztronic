<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryPResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // resultaa of category
          return [
            'id' => $this->id,
            'isdeleted' => $this->isdeleted,
            'designationAR' => $this->designationAR,
            'designationEN' => $this->designationEN,
            'designationFR' => $this->designationFR,
            'Available' => $this->products()->sum('quantity'),
            'User'=>$this->User()->first('fullname'),
            'created_at'=>$this->created_at,
        ];
    }
}
