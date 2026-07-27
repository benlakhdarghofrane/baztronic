<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Image extends Model
{
    use HasFactory;
    protected $fillable = [
        'denomination',
        'path',
        'extension',
        'idUser'

    ];
    public  function products()
    {
        return $this->belongsToMany(Product::class, 'image_products',  'idimage','idproduct');
    }


}
