<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Http\Resources\DocResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $dou = $request->dou;
        $docs = Document::query()->join('dous', 'dous.id', 'documents.iddou')
            ->where('dous.subdomain', $dou)->orderBy('id', 'desc')->get('documents.*');
        if ($docs)
            return DocResource::collection($docs);

        return response('Documnts not fuond ', 422);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDocumentRequest $request)
    {
        $data = $request->validated();
        $user = Auth()->user();
        $data["idDou"] = $user->idDou;
        $data['path'] = $request->file('path')->store('document');
        $doc = Document::create($data);
        return response(new DocResource($doc), 200);
    }

    public function getDoc($path)
    {
        $doc = Storage::get($path);
        if ($doc)
            return response($doc, 200)->header('Content-Type', Storage::mimeType($path));

        return response('Documnt not fuond ', 422);
    }
    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $document = Document::find($request->id);
        $doc = Storage::get($document->path);
        if ($doc)
            return response($doc, 200)->header('Content-Type', Storage::mimeType($doc));
          // returnresponse()->download($doc);
        return response('Documnt not fuond ', 422);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocumentRequest $request, Document $document)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        $document->Pubs()->detach();
        $document->delete();
        return response('', 200);
    }
}
