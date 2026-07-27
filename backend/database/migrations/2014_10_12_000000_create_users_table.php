<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::defaultStringLength(191);
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('fullname',100);
            $table->string('phone',100);
            $table->string('username',100);
            $table->unsignedInteger('idFournisseur')->unsigned()->default(0);
            $table->boolean("isdeleted")->default(false);
            $table->string('email');
            $table->timestamp('email_verified_at')->nullable();
          //  $table->boolean('admin');
            $table->string('role');
            $table->string('password');
            $table->boolean('passIschanged')->default(true);
            $table->rememberToken();
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'));
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};