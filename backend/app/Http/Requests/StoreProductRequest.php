<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
        // list variables for add product
        return [
            'refernce'=>'string|unique:products,refernce|nullable',
            'barcode'=>'string|unique:products,barcode|nullable',
            'id_productlot'=>'integer|nullable',
            'designationAR'=>'string|nullable',
            'imei'=>'string|unique:products,imei|nullable',
            'serial_number'=>'string|unique:products,serial_number|nullable',
            'color'=>'string|nullable',
            'designationEN'=>'string',
            'designationFR'=>'string|nullable',
            'description'=>'string|nullable',
            'purchase_price'=>'numeric',
            'sale_price'=>'numeric',
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
