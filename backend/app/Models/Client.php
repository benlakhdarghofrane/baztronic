<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory;
    protected $fillable = [
        'fullname',
        'phone',
        'email',
        'adresse',
        'idUser',
    ];

    public function Sales():HasMany
    {
        return $this->HasMany(SalesOrder::class,'idClient','id');
    }

    public function User():BelongsTo
    {
        return $this->BelongsTo(User::class,'idUser','id');
    }
}
