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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('denomination');
            $table->boolean("isdeleted")->default(false);

            $table->string('path');
            $table->string('extension');
            $table->unsignedBiginteger('iduserCreated')->unsigned();
            $table->unsignedBiginteger('iduserUpdated')->unsigned();
            $table->foreign('iduserCreated')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('iduserUpdated')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'));

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};