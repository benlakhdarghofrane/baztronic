<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReceiptOrderRequest extends FormRequest
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
        // list variables for add reciept order ( bon d'achet)
        return [
            'idFournisseur'=>'integer',
            'priceT'=>'numeric',
            'status'=>'string|nullable',
            'payment'=>'numeric',
            'rest'=>'numeric',
            'depot'=>'boolean|nullable',
            ];
    }
}
