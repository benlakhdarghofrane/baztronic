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
        Schema::create('fournisseurs', function (Blueprint $table) {
            $table->id();
            $table->string("fullname")->nullable(false);
            $table->string("numRig")->nullable(false);
            $table->string("phone")->nullable(false);
            $table->string("email")->default("");
            $table->string("adresse")->default("");
            $table->boolean("isdeleted")->default(false);
            $table->unsignedBiginteger('idUser')->unsigned();
            $table->foreign("idUser")->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
         
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fournisseurs');
    }
};
