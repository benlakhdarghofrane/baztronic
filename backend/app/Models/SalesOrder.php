<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SalesOrder extends Model
{
    use HasFactory;
    protected $fillable = [
        'idClient',
        'reference',
        'dateOrder',
        'status',
        'typePaiment',
        'paid',
        'enable_taxes',
        'priceHT',
        'taxes',
        'priceTTC',
        'guarantee',
        'idUser',
    ];
    public function Details():HasMany
    {
        return $this->HasMany(SalesOrderDetails::class,'idsale','id');
    }

    public function User():BelongsTo
    {
        return $this->BelongsTo(User::class,'idUser','id');
    }

    public function Client():BelongsTo
    {
        return $this->BelongsTo(Client::class,'idClient','id');
    }
}
