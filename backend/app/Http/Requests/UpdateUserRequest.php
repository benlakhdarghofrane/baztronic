<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;


class UpdateUserRequest extends FormRequest
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
            'fullname'=>'string|nullable',
            'username'=> 'required|unique:users,username,'.$this->user->id.',id',
            'email'=>'email|nullable',
            'phone'=>'string|nullable',
            'role'=>'string|nullable',
            'passIschanged'=>'boolean|nullable',
            'password'=>'min:8|nullable',
            'idFournisseur'=>'integer|nullable',
        ];
    }
}
