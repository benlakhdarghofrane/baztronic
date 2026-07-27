<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLotRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'entry_date' => 'required|date',
            'reference' => 'nullable|string',
            'quantity' => 'required|integer|min:0',
            'name' => 'required|string',
            'supplier' => 'required|integer|exists:fournisseurs,id',
            'device_type' => 'required|integer|exists:categories,id',
            'device_count' => 'nullable|integer|min:0',
            'price' => 'nullable|numeric|min:0',
            'note' => 'nullable|string',
        ];
    }
}
