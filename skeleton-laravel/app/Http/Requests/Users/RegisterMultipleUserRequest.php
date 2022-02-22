<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterMultipleUserRequest extends FormRequest
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
            'csv_file' => 'required|file|mimes:csv,txt'
        ];
    }

    public function csvHeaderRules()
    {
        return [
            '0' => 'required|in:Name',
            '1' => 'required|in:Email',
            '2' => 'required|in:Gender',
            '3' => 'required|in:Birthday',
            '4' => 'required|in:Password',
            '5' => 'required|in:MembershipType',
            '6' => 'required|in:Affiliation',
            '7' => 'required|in:Department',
            '8' => 'required|in:Remarks',
        ];
    }

    public function csvHeaderMessages()
    {
        return [
            '0' => 'Name header is invalid',
            '1' => 'Email header is invalid',
            '3' => 'Gender header is invalid',
            '2' => 'Birthday header is invalid',
            '4' => 'Password header is invalid',
            '5' => 'MembershipType header is invalid',
            '6' => 'Affiliation header is invalid',
            '7' => 'Department header is invalid',
            '8' => 'Remarks header is invalid',
        ];
    }

    public function csvFileRules()
    {
        return [
            '*.Name' => 'required|string', // Name
            '*.Email' => 'required|email|unique:users,email|distinct', // Email
            '*.Gender' => 'required|string|in:unknown,male,female', // Gender
            '*.Birthday' => 'required|before:tomorrow', // Birthday
            '*.Password' => [
                'required',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ], // Password
            '*.MembershipType' => 'nullable|string|in:trial,individual,corporate,admin', // Membership Type
            '*.Affiliation' => 'nullable|string', // Affiliation
            '*.Department' => 'nullable|string', // Department
            '*.Remarks' => 'nullable|string', // Remarks
        ];
    }

    public function csvFileMessages()
    {
        return [
            '*.*.in' => 'The :attribute must be one of the following types: :values',
        ];
    }

    public function affiliationRules() {
        return [
            'affiliation' => 'required|exists:affiliations,id', // Name
        ];
    }

    public function departmentRules() {
        return [
            'department' => 'required|exists:departments,id', // Name
        ];
    }

    public function membershipTypeRules() {
        return [
            'membershipType' => 'required|lt:3', // Name
        ];
    }

    public function membershipTypeMessages()
    {
        return [
            'membershipType.lt' => 'User is not authorized to create Admin accounts',
        ];
    }
}
