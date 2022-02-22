<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterNewUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string',
            'email' => 'required|confirmed|unique:users,email',
            'email_confirmation' => 'required',
            'sex' => 'required|numeric',
            'birthday' => 'required|before:tomorrow',
            'image' => 'nullable',
            'membership_type' => 'required|numeric',
            'affiliation_id' => 'nullable|numeric',
            'remarks' => 'nullable|string',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
            'password_confirmation' => 'required',
            'department_id' => 'nullable|numeric',
            'department_child_id' => 'nullable|numeric'
        ];
    }
}
