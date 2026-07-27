<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddDouRequest extends FormRequest
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
        'nameAR'=>'string|unique:dous,nameAR',
        'nameEN'=>'string|unique:dous,nameEN',
        'nameFR'=>'string|unique:dous,nameFR',
        'descriptionAR'=>'string',
        'descriptionEN'=>'string',
        'descriptionFR'=>'string',
        'NomPrenomDAR'=>'string',
        'NomPrenomDEN'=>'string',
        'NomPrenomDFR'=>'string',
        'fix'=>'string',
        'fax'=>'string',
        'email'=>'string|unique:dous,email',
        'facebook'=>'string',
        'region'=>'string',
        'adresseAR'=>'string',
        'adresseEN'=>'string',
        'adresseFR'=>'string',
        'latitude'=>'numeric',
        'longitude'=>'numeric',
        'dateCreation'=>'date',

        ];
    }
}
