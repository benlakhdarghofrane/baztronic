<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReceiptOrder extends Model
{
    use HasFactory;
    protected $fillable = [
        'reference',
        'dateReceipt',
        'status',
        'priceT',
        'payment',
        'rest',
        'idUser',
        'depot',
        'idFournisseur',
    ];

    public function Detailsreceipts():HasMany
    {
        return $this->HasMany(Detailsreceipt::class,'idreceipt','id');
    }
    public function User():BelongsTo
    {
        return $this->BelongsTo(User::class,'idUser','id');
    }
    public function Fournisseur():BelongsTo
    {
        return $this->BelongsTo(Fournisseur::class,'idFournisseur','id');
    }
}
