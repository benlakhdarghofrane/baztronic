<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
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
        // list variables for add caregory
        return [
            'designationAR'=>'string|unique:categories,designationAR|nullable',
            'designationEN'=>'string|unique:categories,designationEN',
            'designationFR'=>'string|unique:categories,designationFR|nullable',
            ];
        }
}
