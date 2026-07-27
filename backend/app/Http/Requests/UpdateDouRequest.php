<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDouRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'descriptionAR' => 'string|nullable',
            'descriptionEN' => 'string|nullable',
            'descriptionFR' => 'string|nullable',
            'fix' => 'string|nullable',
            'fax' => 'string|nullable',
            'email' => 'email|unique:dous,email,'.$this->dou->id.',id',
            'facebook' => 'string|nullable',
            'region' => 'string|nullable',
            'adresseAR' => 'string|nullable',
            'adresseEN' => 'string|nullable',
            'adresseFR' => 'string|nullable',
            'latitude' => 'numeric|nullable',
            'longitude' => 'numeric|nullable',

        ];
    }
}
