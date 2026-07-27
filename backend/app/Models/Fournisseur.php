<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Fournisseur extends Model
{
    use HasFactory;
    protected $fillable = [
        'fullname',
        'numRig',
        'phone',
        'email',
        'adresse',
        'idUser',
    ];

    public function OrderDelivrys():HasMany
    {
        return $this->HasMany(DeliveryOrder::class,'idFournisseur','id');
    }
    public function OrderReceipts():HasMany
    {
        return $this->HasMany(ReceiptOrder::class,'idFournisseur','id');
    }
    public function User():BelongsTo
    {
        return $this->BelongsTo(User::class,'idUser','id');
    }

}
