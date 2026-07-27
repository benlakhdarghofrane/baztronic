<?php

namespace App\Http\Resources;

use App\Models\Wilaya;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DouResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $images=$this->images()->get(['images.path']);
       return[
        'id' => $this->id,
        'subdomain'=>$this->subdomain,
        'nameAR'=> $this->nameAR,
        'nameEN'=> $this->nameEN,
        'nameFR'=> $this->nameFR,
        'descriptionAR'=>$this->descriptionAR,
        'descriptionEN'=>$this->descriptionEN,
        'descriptionFR'=>$this->descriptionFR,
        'NomPrenomDAR'=>$this->NomPrenomDAR,
        'NomPrenomDEN'=>$this->NomPrenomDEN,
        'NomPrenomDFR'=>$this->NomPrenomDFR,
        'fix'=> $this->fix,
        'fax'=> $this->fax,
        'email'=> $this->email,
        'facebook'=>$this->facebook,
        'region'=> $this->region,
        'latitude'=>$this->latitude,
        'longitude'=>$this->longitude,
        'adresseAR'=> $this->adresseAR,
        'adresseEN'=> $this->adresseEN,
        'adresseFR'=> $this->adresseFR,
        'images'=>$images
       ];
    }
}
