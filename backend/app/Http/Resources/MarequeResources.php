<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MarequeResources extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
      $cat=  $this->Category()->first();
        return [
            'id' => $this->id,
            'name' => $this->name,
            'Category' =>$cat!=null? $cat->designationEN:"",
            'User'=>$this->User()->first('fullname'),
            'created_at'=>$this->created_at,
        ];
    }
}
