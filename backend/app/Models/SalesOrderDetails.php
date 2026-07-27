<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalesOrderDetails extends Model
{
    use HasFactory;
    protected $fillable = [
        'idsale',
        'idProduct',
        'priceU',
        'qnt',
        'price',
        'idUser',
    ];

    public function SaleOrder():BelongsTo
    {
        return $this->BelongsTo(SalesOrder::class,'idsale','id');
    }
    public function Product():BelongsTo
    {
        return $this->BelongsTo(Product::class,'idProduct','id');
    }
    public function User():BelongsTo
    {
        return $this->BelongsTo(User::class,'idUser','id');
    }
}
