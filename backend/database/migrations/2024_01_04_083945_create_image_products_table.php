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
        Schema::create('image_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBiginteger('idimage')->unsigned();
            $table->unsignedBiginteger('idproduct')->unsigned();
            $table->unsignedBiginteger('idUser')->unsigned();
            $table->foreign('idimage')->references('id')->on('images')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('idproduct')->references('id')->on('products')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('idUser')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');

            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'));

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('image_products');
    }
};
