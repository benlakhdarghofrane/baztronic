<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Item;
use App\Models\SubItem;
use App\Models\User;
use App\Models\UserItemSubItem;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
      //  \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'Fullname' => 'Azil brahim',
        //     'username' => 'azil',
        //     'phone' => '0000000',
        //     'email' => 'azil@gmail.com.com',
        //     'password'=>bcrypt('Azil2023'),
        //     'role'=>'Admin',
        // ]);
        $user=User::find(1);
        $items=Item::all();
        $subItems=SubItem::all();
        foreach( $items as $item)
          {   foreach( $subItems as $sitem)
            {
                $data=['iduser'=>$user->id,
                'iditem'=>$item->id,
                'idsubitem'=>$sitem->id,
                'iduserCreated'=>1,
                'iduserUpdated'=>1,
                ];
                UserItemSubItem::create($data);
            }}
            // $items=Item::find(9);
            // //$subItems=SubItem::all();

            //     foreach( $subItems as $sitem)
            //     {
            //         $data=['iduser'=>$user->id,
            //         'iditem'=>$items->id,
            //         'idsubitem'=>$sitem->id,
            //         'iduserCreated'=>1,
            //         'iduserUpdated'=>1,
            //         'accees'=>'111'];
            //         UserItemSubItem::create($data);
            //     }

            //     $items=Item::find(10);
            //     //$subItems=SubItem::all();

            //         foreach( $subItems as $sitem)
            //         {
            //             $data=['iduser'=>$user->id,
            //             'iditem'=>$items->id,
            //             'idsubitem'=>$sitem->id,
            //             'iduserCreated'=>1,
            //             'iduserUpdated'=>1,
            //             'accees'=>'111'];
            //             UserItemSubItem::create($data);
            //         }

    }
    }

