<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lot extends Model
{
    protected $table = 'lots';

    protected $fillable = [
        'entry_date',
        'name',
        'reference',
        'supplier',
        'device_type',
        'quantity',
        'device_count',
        'price',
        'note',
        'isdeleted',
        'id_user',
    ];

    public function Supplier(): BelongsTo
    {
        return $this->BelongsTo(Fournisseur::class, 'supplier', 'id');
    }

    public function Category(): BelongsTo
    {
        return $this->BelongsTo(Category::class, 'device_type', 'id');
    }

    public function User(): BelongsTo
    {
        return $this->BelongsTo(User::class, 'id_user', 'id');
    }
}
