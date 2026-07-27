<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wilaya extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'nameAR',
        'nameEN',
        'nameFR',
    ];

    public function dous(): HasMany
    {
        return $this->HasMany(Dou::class,'idWilaya','id');
    }
}
