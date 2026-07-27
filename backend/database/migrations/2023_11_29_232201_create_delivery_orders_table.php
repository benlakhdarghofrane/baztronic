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
        Schema::create('delivery_orders', function (Blueprint $table) {
            $table->id();
            $table->string("reference")->unique();
            $table->date("dateDelivery")->nullable(false);
            $table->string("status")->default("");
            $table->double('priceT');
            $table->boolean("isdeleted")->default(false);
            $table->unsignedBiginteger('idFournisseur')->unsigned();
            $table->unsignedBiginteger('idUser')->unsigned();   
            $table->foreign("idUser")->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');  
            $table->foreign("idFournisseur")->references('id')->on('fournisseurs')->onDelete('cascade')->onUpdate('cascade');  
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP')); 

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_orders');
    }
};
