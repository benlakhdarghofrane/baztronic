<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResourceClient extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
          //  result of  Clients  form json ()
        return [
            'id' => $this->id,
            'fullname'=>$this->fullname,
            'phone'=>$this->phone,
            'email'=>$this->email,
            'points'=>$this->points,
            'adresse'=>$this->adresse,
            'user' => $this->User()->first()->username,
            'created_at'=>$this->created_at,
        ];}
}
