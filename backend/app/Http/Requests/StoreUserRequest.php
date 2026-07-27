<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
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
            'fullname'=>'string',
            'username'=>'required|string|max:55|unique:users,username',
            'email'=>'required|email',
            'phone'=>'string',
            'role'=>'string',
            'passIschanged'=>'boolean|nullable',
            'idFournisseur'=>'integer|nullable',
            'password'=>[
                'required',
                'confirmed',
                 Password::min(8)
                 ->letters()

            ]

        ];
    }
}
