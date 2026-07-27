<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'refernce',
        'barcode',
        'designationAR',
        'designationEN',
        'designationFR',
        'imei',
        'serial_number',
        'color',
        'quantity',
        'purchase_price',
        'sale_price',
        'idcategory',
        'mareque',
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
        'idFournisseur',
        'id_productlot'
    ];



    public function Categorie(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'idcategory', 'id');
    }
    public function Fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class, 'idFournisseur', 'id');
    }
    public function Mareque(): BelongsTo
    {
        return $this->belongsTo(Mareque::class, 'mareque', 'id');
    }
    public function Models(): BelongsTo
    {
        return $this->belongsTo(Models::class, 'model', 'id');
    }
    public function User(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idUser', 'id');
    }

    public function DetailsOrderDelivry(): HasMany
    {
        return $this->HasMany(DetailsDelivry::class,'idproduct','id');
    }

    public function DetailsOrderFrom(): HasMany
    {
        return $this->HasMany(OrderformDetails::class,'idproduct','id');
    }
    public function DetailsReceipts(): HasMany
    {
        return $this->HasMany(Detailsreceipt::class,'idproduct','id');
    }
    public  function images()
    {
        return $this->belongsToMany(Image::class, 'image_products',  'idproduct','idimage');
    }
     public function ProductLot(): BelongsTo
    {
        return $this->belongsTo(ProductLot::class, 'id_productlot', 'id');
    }
}
