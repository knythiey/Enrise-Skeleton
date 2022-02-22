<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = "users";

    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
	    'mail_address',
	    'first_name',
	    'first_name_furigana',
	    'last_name',
	    'last_name_furigana',
	    'birthday',
	    'gender_id',
	    'address_id',
	    'tel',
	    'educational_background_id',
	    'first_language',
	    'toeic',
	    'toefl',
	    'annual_income',
	    'password',
        'status_id',
        'change_job_id',
        'account_status',
        'account_type_id',
        'last_login_day',
        'user_type_id',
        'scout'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
