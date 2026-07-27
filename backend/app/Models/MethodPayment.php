<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MethodPayment extends Model
{
    use HasFactory;
    protected $fillable = [

        'name',
        'idUser',
    ];


    public function User():BelongsTo
    {
        return $this->BelongsTo(User::class,'idUser','id');
    }
}
