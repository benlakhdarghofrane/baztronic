<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductLot extends Model
{
    use HasFactory;
     protected $table = 'products_lot';
     protected $primaryKey = 'id';
    protected $fillable = [
        'id',
        'reference',
        'barcode',
        'imei',
        'serial_number',
        'lock_status',
        'screen_state',
        'housing_state',
        'charge_state',
        'battrystate',
        'designationAR',
        'designationEN',
        'designationFR',
        'quantity',
        'purchase_price',
        'sale_price',
        'id_lot',
        'marque',
        'model',
        'idUser',
        'description',
        'ram',
        'processeur',
        'stokage',
        'screen',
        'battery',
        'carteGraphique',
        'min_quantity',
        'max_quantity',
        'status',
        'color',
        'tauchscreen',
        'operatingsystem',
        'conditions',
        'keyboard',
        'isdeleted',
    ];



    public function Lot(): BelongsTo
    {
        return $this->belongsTo(Lot::class, 'id_lot', 'id');
    }
        public function Marque(): BelongsTo
    {
        return $this->belongsTo(Mareque::class, 'marque', 'id');
    }
        public function Model(): BelongsTo
    {
        return $this->belongsTo(Models::class, 'model', 'id');
    }
    public function User(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idUser', 'id');
    }

}
