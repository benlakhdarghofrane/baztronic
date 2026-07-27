<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

use function PHPUnit\Framework\isEmpty;

class ProductLotResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $Lot=$this->Lot()->first();

        return [
            'id' => $this->id,
            'lot'=>$Lot!=null?['id'=>$Lot->id,'name'=>$Lot->reference,'device_count'=>$Lot->device_count,'device_type'=>$Lot->device_type]:[],
            'reference' => $this->reference,
            'imei' => $this->imei,
            'marque' => $this->marque,
            'model' => $this->model,
            'serial_number' => $this->serial_number,
            'barcode' => $this->barcode,
            'charge_state'=> $this->charge_state,
            'battrystate'=> $this->battrystate,
            'lock_status' => $this->lock_status,
            'screen_state' => $this->screen_state,
            'housing_state' => $this->housing_state,
            'designationEN' => $this->designationEN,
          //  'designationFR' => $this->designationFR,
            'description'=>$this->description,
            'purchasePrice'=>$this->purchase_price,
            'salePrice'=>$this->sale_price,
            'quantity'=>$this->quantity,
            'max_quantity'=>$this->max_quantity,
            'min_quantity'=>$this->min_quantity,
            'processeur'=>$this->processeur,
            'ram'=>$this->ram,
            'stokage'=>$this->stokage,
            'screen'=>$this->screen,
            'carteGraphique'=>$this->carteGraphique,
            'battery'=>$this->battery,
            'status'=>$this->status,
            'color'=>$this->color,
            'tauchscreen'=>$this->tauchscreen,
            'operatingsystem'=>$this->operatingsystem,
            'conditions'=>$this->conditions,
            'keyboard'=>$this->keyboard,
            'created_at'=>$this->created_at,
            'initQnt'=>$this->initQnt!=null?$this->initQnt:$this->quantity,
            'finalQnt'=>$this->finalQnt!=null?$this->finalQnt:$this->quantity,
        ];
    }
    // result of  product form json if client


}
