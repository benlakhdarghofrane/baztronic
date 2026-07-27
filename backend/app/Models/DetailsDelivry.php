<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DetailsDelivry extends Model
{
    use HasFactory;
    protected $fillable = [
        'iddelivery',
        'idProduct',
        'priceU',    
        'qnt',    
        'unit',
        'price',    
        'idUser',    
    ];
    public function DelivryOrder():BelongsTo
    {
        return $this->BelongsTo(DeliveryOrder::class,'iddelivery','id');
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
