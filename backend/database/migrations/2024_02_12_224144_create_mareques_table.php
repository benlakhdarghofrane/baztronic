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
        Schema::create('mareques', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBiginteger('idcategory')->unsigned();
            $table->unsignedBiginteger('idUser')->unsigned();
            $table->boolean("isdeleted")->default(false);
            $table->foreign("idcategory")->references('id')->on('categories')->onDelete('cascade')->onUpdate('cascade');
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
        Schema::dropIfExists('mareques');
    }
};
