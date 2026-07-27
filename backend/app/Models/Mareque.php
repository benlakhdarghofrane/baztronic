<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mareque extends Model
{
    use HasFactory;
    protected $fillable = [
        'idcategory',
        'name',
        'idUser',];
    public function Category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'idcategory', 'id');
    }
    public function Models(): HasMany
    {
        return $this->hasMany(Models::class, 'idmareque', 'id');
    }
    public function User():BelongsTo
    {
        return $this->BelongsTo(User::class,'idUser','id');
    }
}
