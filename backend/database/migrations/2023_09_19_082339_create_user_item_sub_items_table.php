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
        Schema::create('user_item_sub_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBiginteger('iduser')->unsigned();
            $table->unsignedBiginteger('iditem')->unsigned();
            $table->unsignedBiginteger('idsubitem')->unsigned();
            $table->string('accees',3)->default('000');
            $table->unsignedBiginteger('iduserCreated')->unsigned();
            $table->unsignedBiginteger('iduserUpdated')->unsigned();

            $table->foreign('iduser')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('iditem')->references('id')->on('items')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('idsubitem')->references('id')->on('sub_items')->onDelete('cascade')->onUpdate('cascade');

            $table->foreign('iduserCreated')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('iduserUpdated')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->unique(['iduser', 'iditem','idsubitem'], 'athlete_annee_club_unique');
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'));

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_item_sub_items');
    }
};
