<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReceiptOrderRequest extends FormRequest
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
            'idFournisseur'=>'integer|nullable',
            'priceT'=>'numeric|nullable',
            'status'=>'string|nullable',
            'payment'=>'numeric|nullable',
            'rest'=>'numeric|nullable',
            'depot'=>'boolean|nullable',
            ];
    }
}
