<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Detailsreceipt extends Model
{
    use HasFactory;
    protected $fillable = [
        'idreceipt',
        'idProduct',
        'priceU',
        'qnt',
        'priceHT',
        'taxes',
        'extraExpenes',
        'priceT',
        'description',
        'idUser',
    ];

    public function ReceiptOrder():BelongsTo
    {
        return $this->BelongsTo(ReceiptOrder::class,'idreceipt','id');
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
