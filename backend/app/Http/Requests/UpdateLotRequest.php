<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLotRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'entry_date' => 'sometimes|date',
            'name' => 'required|string',
            'quantity' => 'sometimes|integer|min:0',
            'supplier' => 'sometimes|integer|exists:suppliers,id',
            'device_type' => 'sometimes|integer|exists:categories,id',
            'device_count' => 'sometimes|integer|min:0',
            'price' => 'sometimes|numeric|min:0',
            'note' => 'nullable|string',
            'id_user' => 'sometimes|integer|exists:users,id',
        ];
    }
}
