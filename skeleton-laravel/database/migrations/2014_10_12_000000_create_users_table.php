<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('mail_address');
            $table->string('first_name');
            $table->string('first_name_furigana');
            $table->string('last_name');
            $table->string('last_name_furigana');
            $table->date('birthday');
            // TODO:: make foreign key contraint on these nullable column
            $table->integer('gender_id')->nullable();
            $table->integer('address_id')->nullable();
            $table->string('tel');
            $table->integer('educational_background_id')->nullable();
            $table->string('first_language');
            $table->integer('toeic');
            $table->integer('toefl');
            $table->string('annual_income');
            $table->string('password');
            $table->integer('status_id')->nullable();
            $table->integer('change_job_id')->nullable();
            $table->boolean('account_status');
            $table->integer('account_type_id')->nullable();
            $table->date('last_login_day')->nullable()->default(Carbon::now()->format('Y-m-d H:i:s'));
            $table->integer('user_type_id')->nullable();
            $table->boolean('scout')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
