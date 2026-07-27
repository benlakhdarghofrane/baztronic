<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddRURequest extends FormRequest
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
            'nameAR'=>'required|string|unique:rus,nameAR',
            'nameEN'=>'required|string|unique:rus,nameEN',
            'nameFR'=>'required|string|unique:rus,nameFR',
            'descriptionAR'=>'string',
            'descriptionEN'=>'string|nullable',
            'descriptionFR'=>'string|nullable',
            'idDou'=>'required|integer',
            'fix'=>'required|string|max:10|nullable',
            'fax'=>'string|max:10|nullable',
            'facebook'=>'string|nullable',
            'email'=>'required|email|unique:rus,email|nullable',
            'adresseAR'=>'string|nullable',
            'adresseEN'=>'string|nullable',
            'adresseFR'=>'String|nullable',
            'visiteVirtuelle'=>'String|nullable',
            'PathVideo'=>'String|nullable',
        
        ];
    }
}
