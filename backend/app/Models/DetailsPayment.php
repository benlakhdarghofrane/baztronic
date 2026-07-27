<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailsPayment extends Model
{
    use HasFactory;
    protected $fillable = [
        'type',
        'amount',
        'rest',
        'idFournisseur',
        'idOrder',
        'idUser',
    ];


    public function Fournisseur():BelongsTo
    {
        return $this->BelongsTo(Fournisseur::class,'idFournisseur','id');
    }
    public function Order():BelongsTo
    {
        return $this->BelongsTo(ReceiptOrder::class,'idOrder','id');
    }
    public function User():BelongsTo
    {
        return $this->BelongsTo(User::class,'idUser','id');
    }
}
