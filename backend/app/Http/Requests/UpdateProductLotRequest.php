<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductLotRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'reference'=>'string|unique:products_lot,reference,'.$this->productsLot->id.',id|nullable',
            'barcode'=>'string|unique:products_lot,barcode,'.$this->productsLot->id.',id|nullable',
            'imei'=>'string|unique:products_lot,imei,'.$this->productsLot->id.',id|nullable',
            'serial_number'=>'string|unique:products_lot,serial_number,'.$this->productsLot->id.',id|nullable',
            'marque' => 'integer',
            'model' => 'integer',
            'lock_status'=>'string|nullable',
            'screen_state'=>'string|nullable',
            'housing_state'=>'string|nullable',
            'charge_state'=>'string|nullable',
            'battrystate'=>'string|nullable',
            'designationAR'=>'string|nullable',
            'designationEN'=>'string|nullable',
            'designationFR'=>'string|nullable',
            'description'=>'string|nullable',
            'purchase_price'=>'numeric|nullable',
            'sale_price'=>'numeric|nullable',
            'quantity'=>'numeric|nullable',
            'ram'=>'string|nullable',
            'processeur'=>'string|nullable',
            'stokage'=>'string|nullable',
            'screen'=>'string|nullable',
            'battery'=>'string|nullable',
            'carteGraphique'=>'string|nullable',
            'min_quantity'=>'numeric|nullable',
            'max_quantity'=>'numeric|nullable',
            'status'=>'string|nullable',
            'id_lot'=>'integer',
            'color'=>'string|nullable',
            'tauchscreen'=>'string|nullable',
            'operatingsystem'=>'string|nullable',
            'conditions'=>'string|nullable',
            'keyboard'=>'string|nullable',
        ];
    }
}
