<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $trueOrFalse = [false, true];
        return [
            'mail_address' => $this->faker->unique()->safeEmail(),
            'first_name' => $this->faker->firstName(),
            'first_name_furigana' => '管理者',
            'last_name' => $this->faker->lastName(),
            'last_name_furigana' => $this->faker->name(),
            'birthday' => $this->faker->dateTimeBetween('1990-01-01', '2021-12-31'),
            'gender_id' => rand(0, 2),
            'address_id' => rand(0, 2),
            'tel' => $this->faker->phoneNumber(),
            'educational_background_id' => rand(0, 2),
            'first_language' => 'Japanese',
            'toeic' => rand(0, 2),
            'toefl' => rand(0, 2),
            'annual_income' => rand(5000, 50000),
            'password' => Hash::make('123'),
            'status_id' => rand(0, 2),
            'change_job_id' => rand(0, 2),
            'account_status' => $trueOrFalse[rand(0, 1)],
            'account_type_id' => rand(0, 2),
            'last_login_day' => $this->faker->dateTimeBetween('1990-01-01', '2021-12-31'),
            'user_type_id' => rand(0, 2),
            'scout' => $trueOrFalse[rand(0, 1)],
	        'remember_token' => null,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unverified()
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }
}
