<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = Carbon::now('utc')->toDateTimeString();
        User::insert(
            [
                'mail_address' => 'admin@gmail.com',
                'first_name' => 'Admin',
                'first_name_furigana' => '管理者',
                'last_name' => 'itcejobs',
                'last_name_furigana' => 'itcejobs',
                'birthday' => $now,
                'gender_id' => 1,
                'address_id' => 1,
                'tel' => 1234567,
                'educational_background_id' => 1,
                'first_language' => 'Japanese',
                'toeic' => 1,
                'toefl' => 1,
                'annual_income' => 10000,
                'password' => Hash::make('123'),
                'status_id' => 1,
                'change_job_id' => 1,
                'account_status' => true,
                'account_type_id' => 1,
                'last_login_day' => $now,
                'user_type_id' => 1,
                'scout' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        );
        
        //User::factory()->count(10)->create();
    }
}
