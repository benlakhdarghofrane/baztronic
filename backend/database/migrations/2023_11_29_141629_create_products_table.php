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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string("refernce")->unique();
            $table->string("barcode")->unique();
            $table->string("designationAR")->default('');;
            $table->string("designationEN");
            $table->string("designationFR")->default('');;
            $table->string("description")->default('');
            $table->string("ram")->default('');
            $table->string("processeur")->default('');
            $table->string("stokage")->default('');
            $table->string("screen")->default('');
            $table->string("battery")->default('');
            $table->string("carteGraphique")->default('');
            $table->unsignedBiginteger('idFournisseur')->unsigned()->default(0);
            $table->double("purchase_price")->default(0);
            $table->double("sale_price")->default(0);
            $table->double("quantity")->default(0);
            $table->double("min_quantity")->default(0);
            $table->double("max_quantity")->default(0);
            $table->string('status')->default('draft');
            $table->unsignedBiginteger('idUser')->unsigned();
            $table->unsignedBiginteger('idcategory')->unsigned();
            $table->unsignedBiginteger("mareque")->nullable();
            $table->unsignedBiginteger("model")->nullable();
            $table->boolean("isdeleted")->default(false);
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
        Schema::dropIfExists('products');
    }
};