<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRURequest extends FormRequest
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
            
            'descriptionAR'=>'string',
            'descriptionEN'=>'string|nullable',
            'descriptionFR'=>'string|nullable',
            'fix'=>'string|max:10|unique:rus,fix,'.$this->ru->id.',id|nullable',
            'fax'=>'string|max:10|unique:rus,fax,'.$this->ru->id.',id|nullable',
            'email'=>'email|unique:rus,email,'.$this->ru->id.',id|nullable',
            'facebook'=>'string|unique:rus,facebook,'.$this->ru->id.',id|nullable',
            'adresseAR'=>'string|nullable',
            'adresseEN'=>'string|nullable',
            'adresseFR'=>'String|nullable',
            'visiteVirtuelle'=>'String|nullable',
            'PathVideo'=>'String|nullable',

        ];
    }
}
