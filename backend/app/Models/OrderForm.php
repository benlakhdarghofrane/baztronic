<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderForm extends Model
{
    use HasFactory;
    protected $fillable = [
        'reference',
        'dateOrder',
        'status',
        'priceT',
        'idUser',
    ];

    public function DetailsOrdeforn():HasMany
    {
        return $this->HasMany(OrderformDetails::class,'idOrder','id');
    }

    public function User():BelongsTo
    {
        return $this->BelongsTo(User::class,'idUser','id');
    }
}
