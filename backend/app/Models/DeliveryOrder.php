<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeliveryOrder extends Model
{
    use HasFactory;
    protected $fillable = [
        'reference',
        'dateDelivery',
        'status',
        'priceT',
        'idFournisseur',
        'idUser',
    ];

    public function DetailsDelivery():HasMany
    {
        return $this->hasMany(DetailsDelivry::class,'iddelivery','id');
    }
    public function Fournisseur():BelongsTo
    {
        return $this->BelongsTo(Fournisseur::class,'idFournisseur','id');
    }
    public function User():BelongsTo
    {
        return $this->BelongsTo(User::class,'idUser','id');
    }
    public function Dou():BelongsTo
    {
        return $this->BelongsTo(User::class,'idUser','id')->Dou();
    }
    public function Ru():BelongsTo
    {
        return $this->BelongsTo(User::class,'idUser','id')->Ru();
    }
   
}
