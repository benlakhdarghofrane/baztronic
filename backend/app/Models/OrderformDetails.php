<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderformDetails extends Model
{
    use HasFactory;
    protected $fillable = [
        'idOrder',
        'idProduct',
        'priceU',    
        'qnt',    
        'unit',
        'price',    
        'idUser',    
    ];

    public function Orderform():BelongsTo
    {
        return $this->BelongsTo(OrderForm::class,'idOrder','id');
    }
    public function Product():BelongsTo
    {
        return $this->BelongsTo(Product::class,'idProduct','id');
    }
    public function User():BelongsTo
    {
        return $this->BelongsTo(Fournisseur::class,'idUser','id');
    }
  

}
