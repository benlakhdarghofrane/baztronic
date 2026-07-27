<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;
    protected $fillable = [
        'designationAR',
        'designationEN',
        'designationFR',
        'idUser',
    ];

    public function Mareques():HasMany
    {
        return $this->HasMany(Product::class,'idcategory','id');
    }
    public function User():BelongsTo
    {
        return $this->BelongsTo(User::class,'idUser','id');
    }
    public function products()
    {
    return $this->hasMany(Product::class, 'idcategory', 'id');
    }
}
