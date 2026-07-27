<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;
    protected $fillable = [
        'nameAR',
        'nameEN',
        'nameFR',
        'role',
        'item_order',
    ];

    public  function Users()
    {
        return $this->belongsToMany(User::class, 'user_item_sub_items',  'iditem','iduser');
    }


}
