<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResourceFournisseur extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //  result of  fournisseeur  form json ()
        return [
            'id' => $this->id,
            'fullname'=>$this->fullname,
            'numRig'=>$this->numRig,
            'phone'=>$this->phone,
            'email'=>$this->email,
            'adresse'=>$this->adresse,
            'user' => $this->User()->first()->username,
            'created_at'=>$this->created_at,
        ]; }
}
