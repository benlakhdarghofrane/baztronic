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
        Schema::create('sales_orders', function (Blueprint $table) {
            $table->id();
            $table->string("reference",30)->unique();
            $table->date("dateOrder")->nullable(false);
            $table->unsignedBiginteger('idClient')->unsigned()->nullable();
            $table->string('typePaiment')->default("");

            $table->string("status")->default("");
            $table->double('priceHT');
            $table->double('taxes');
            $table->double('priceTTC');
            $table->double('guarantee')->default(0);
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
        Schema::dropIfExists('sales_orders');
    }
};