<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Models extends Model
{
    use HasFactory;

    protected $fillable = [
        'idmareque',
        'name',
        'idUser',];

        public function Mareque(): BelongsTo
    {
        return $this->belongsTo(Mareque::class, 'idmareque', 'id');
    }
    public function Products(): HasMany
    {
        return $this->hasMany(Product::class, 'model', 'id');
    }
    public function User():BelongsTo
    {
        return $this->BelongsTo(User::class,'idUser','id');
    }
}
