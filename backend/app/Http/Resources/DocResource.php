<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocResource extends JsonResource
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
            'denomination' => $this->denomination,
            'path' => $this->path,
            'extension' => $this->extension,
            'idDou' => $this->idDou,
        ];
    }
}
