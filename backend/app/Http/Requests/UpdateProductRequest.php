<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
            'refernce'=>'string|unique:products,refernce,'.$this->product->id.',id|nullable',
            'barcode'=>'string|unique:products,barcode,'.$this->product->id.',id|nullable',
            'designationAR'=>'string|nullable',
            'designationEN'=>'string|nullable',
            'designationFR'=>'string|nullable',
            'imei'=>'string|unique:products_lot,imei,'.$this->product->id.',id|nullable',
            'serial_number'=>'string|unique:products_lot,serial_number,'.$this->product->id.',id|nullable',

            'color'=>'string|nullable',
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
            'idcategory'=>'integer',
            'mareque'=>'integer|nullable',
            'model'=>'integer|nullable',
            'idFournisseur'=>'integer|nullable',
        ];
    }
}
