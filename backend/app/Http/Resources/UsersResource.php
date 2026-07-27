<?php

namespace App\Http\Resources;

use App\Models\UserItemSubItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class UsersResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $item=UserItemSubItem::select(DB::raw( "items.id,items.nameAR,items.nameEN,items.nameFR ,Checkpermistion(users.id,items.id,4) as 'read',
        Checkpermistion(users.id,items.id,1) as 'create',Checkpermistion(users.id,items.id,2) as 'Edit',Checkpermistion(users.id,items.id,3) as 'delete'  "))
        ->rightJoin('users', 'user_item_sub_items.iduser', 'users.id')
        ->rightJoin('items', 'items.id', 'user_item_sub_items.iditem')
        ->where('users.id',$this->id)->groupby('items.id')->orderby('items.item_order')
        ->get();
        return[
            'id'=>$this->id,
            'fullname'=>$this->fullname,
            'username'=>$this->username,
            'phone'=>$this->phone,
            'email'=>$this->email,
            'admin'=>$this->admin,
            'role'=>$this->role,
            'passIschanged'=>$this->passIschanged,
          'items'=> $item,
            'avatar'=>"",
        ];
    }
}
