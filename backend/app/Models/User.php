<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'fullname',
        'phone',
        'username',
        'email',
        'role',
        'password',
      'idFournisseur'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    
    public function OrderFroms(): HasMany
    {
        return $this->HasMany(OrderForm::class,'idUser','id');
    }
    public function OrderRecepts(): HasMany
    {
        return $this->HasMany(ReceiptOrder::class,'idUser','id');
    }
    public function Orderdelivry(): HasMany
    {
        return $this->HasMany(DeliveryOrder::class,'idUser','id');
    }
    public  function Roles()
    {
        return $this->belongsToMany(Item::class, 'user_item_sub_items', 'iduser', 'iditem');
    }
    public function UserItemSibItems(): HasMany
    {
        return $this->HasMany(UserItemSubItem::class,'iduser','id');
    }
    public function  Checkpermistion($iditem,$action){
        $idsubitems=$this->UserItemSibItems()->where([['user_item_sub_items.idItem',$iditem],['user_item_sub_items.idsubitem',$action]])->get('id');
        if(($idsubitems->isEmpty())){
            return false;
        }
    return true;
     }
}
