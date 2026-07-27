<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Lot;
use App\Http\Requests\StoreLotRequest;
use App\Http\Requests\UpdateLotRequest;
use App\Http\Resources\LotResource;
use App\Models\User;
use App\Models\statOrders;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LotController extends Controller
{

        public function index(Request $request)
{
    $query = Lot::query()->whereNull('isdeleted');

    // SEARCH
    if ($request->search) {
        $query->where('name', 'like', '%' . $request->search . '%')
              ->orWhere('note', 'like', '%' . $request->search . '%');
    }

    // PAGINATION
    $lots = $query->latest()->paginate(10);

    return LotResource::collection($lots);
}


    public function store(StoreLotRequest $request)
    {
                if (!$this->Checkpermistion(1)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }

        $data= $request->validated();
        $user = Auth()->user();
        $count = statOrders::query()
            ->where("Type", "6")->value('countT');
        $count = $count + 1;
        $count = str_pad($count, 4, '0', STR_PAD_LEFT);
        $data["reference"] = "LOT-" . now()->format('Y') . $count;
        $data['id_user']=$user->id;

        $lot=Lot::create($data);
        return response(new LotResource($lot),200);

    }

    public function show(Lot $lot)
    {
        return new LotResource($lot);
    }

    public function update(UpdateLotRequest $request, Lot $lot)
    {
          if (!$this->Checkpermistion(2)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $user = Auth()->user();
        $data= $request->validated();
        $data['id_user']=$user->id;

        $lot->update($data);
        return response(new LotResource($lot),200);
    }

    public function destroy(Lot $lot)
    {
         if (!$this->Checkpermistion(3)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
          $lot->isdeleted=true;
            $lot->update();

        return response(  "deleted",200);
    }
        public function  checkpermistion($action){

        $iditem=12;
        $userauth=Auth::user();
        $user=User::find( $userauth->id);
       return $user->checkpermistion($iditem,$action);
     }
}
