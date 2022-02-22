<?php

namespace App\Http\Requests\Users;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
        // When user is admin or corporate, use form request field 'id' for modifying other accounts
        $id = in_array(auth()->user()->membership_type, [2, 3]) ? request()->id : $this->user()->id;
        $rule = [];
        switch (request()->membership_type) {
            case 3:
                // validation for admin
                // $rule += [
                //     'affiliation_id' => 'nullable|numeric',
                //     'remarks' => 'nullable|string',
                // ];
                // continue validation for department fields;
            case 2:
                // validation for corporate
                // $rule += [
                //     'department_id' => 'nullable|numeric',
                //     'department_child_id' => 'nullable|numeric'
                // ];
                // fall-through default validation;
            default:
                // default validation
                $rule += [
                    'id' => 'numeric',
                    'name' => 'required|string',
                    'email' => 'required|unique:users,email,' . $id,
                    'sex' => 'required|numeric',
                    'birthday' => 'required|before:tomorrow',
                    'image' => 'nullable',
                    'membership_type' => 'nullable|numeric',
                    'affiliation_id' => 'nullable|numeric',
                    'remarks' => 'nullable|string',
                    'department_id' => 'nullable|numeric',
                    'department_child_id' => 'nullable|numeric'
                ];
        }
        return $rule;
    }
}
