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
        Schema::create('detailsreceipts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBiginteger('idreceipt')->unsigned();
            $table->unsignedBiginteger('idProduct')->unsigned();
            $table->double('priceU');
            $table->double('qnt');
            $table->string('unit')->default('');
            $table->double('priceHT');
            $table->double('taxes')->default(0);
            $table->double('extraExpenes')->default(0);
            $table->double('priceT');
            $table->string('description');
            $table->boolean('isdeleted')->default(false);
            $table->unsignedBiginteger('idUser')->unsigned();
            $table->foreign("idreceipt")->references('id')->on('receipt_orders')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign("idProduct")->references('id')->on('products')->onDelete('cascade')->onUpdate('cascade');
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
        Schema::dropIfExists('detailsreceipts');
    }
};
