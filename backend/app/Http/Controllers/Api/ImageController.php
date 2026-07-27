<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImageRequest;
use App\Http\Resources\ImageResource;
use App\Models\Image;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{

    public function index(Request $request)
    {
        if (!$this->Checkpermistion(4)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        return ImageResource::collection(
            Image::query()->orderBy('id', 'desc')->paginate()
        );
    }

    public  function Store(ImageRequest $request)
    {

        if (!$this->Checkpermistion(1)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $data = $request->validated();
        $user = Auth()->user();
        $pos = strpos($data['denomination'], '.', -5);
        if ($pos) {
            $data['denomination'] = substr($data['denomination'], 0, $pos);
        }
        $data["idUser"] = $user->id;
        $data['path'] = $request->file('path')->store('image');
        $img = Image::create($data);
        return response(new ImageResource($img), 200);
    }

    public function show(Image $img)
    {
        return new ImageResource($img);
    }
    public function getImage($path)
    {
        $image = Storage::get($path);
        return response($image, 200)->header('Content-Type', Storage::mimeType($path));
    }
    public function destroy(Image $img)
    {
        if (!$this->Checkpermistion(3)) {
            return  response("You Don't Have Permission To Do on This Operation", 422);
        }
        $img->products()->detach();

        $img->delete();
        return response('', 200);
    }
    public function  checkpermistion($action){

        $iditem=4;
        $userauth=Auth::user();
        $user=User::find( $userauth->id);
    return $user->checkpermistion($iditem,$action);
     }

}
