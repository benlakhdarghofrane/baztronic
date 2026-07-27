<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFournisseurRequest extends FormRequest
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
            'fullname'=>'string',
            'numRig'=>'string|unique:fournisseurs,numRig|nullable',
            'phone'=>'string|unique:fournisseurs,phone',
            'email'=>'string|unique:fournisseurs,email',
            'adresse'=>'string',
        ];
    }
}
