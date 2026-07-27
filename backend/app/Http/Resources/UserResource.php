<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $menuItems = ['dashboard', 'Users', 'Category', 'Marque', 'Model', 'products',
            'Product Lot', 'Lots', 'Suppliers', 'Clients', 'Receipt order',
            'Sales Order', 'Deposits', 'Debts'];

        $items = [];
        $i = 1;
        foreach ($menuItems as $name) {
            $items[] = [
                'id' => $i,
                'nameAR' => $name,
                'nameEN' => $name,
                'nameFR' => $name,
                'read' => "1",
                'create' => "1",
                'Edit' => "1",
                'delete' => "1",
            ];
            $i++;
        }

        return [
            'id' => $this->id,
            'fullname' => $this->fullname,
            'username' => $this->username,
            'phone' => $this->phone,
            'email' => $this->email,
            'role' => $this->role,
            'items' => $items,
            'passIschanged' => $this->passIschanged,
            'avatar' => "",
        ];
    }
}