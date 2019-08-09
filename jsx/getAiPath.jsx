(function(){
    if(documents.length < 1){
	    alert("ドキュメントが開かれていません!");
	    return false;
	}
    var obj = {
        path:decodeURI(activeDocument.path.toString()),
        name:decodeURI(activeDocument.name.toString()),
        fullName:decodeURI(activeDocument.fullName.toString())
    }
    return JSON.stringify(obj);
})();