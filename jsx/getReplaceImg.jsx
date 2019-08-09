(function(){
    var objects = activeDocument.pageItems;
    if(objects.length<1){
        alert("nothing objects on the Document");
        return false;
    }
    var array = [];
    for(var i=0;i<objects.length;i++){
        if(objects[i].typename == "PlacedItem"){
            array.push({});
            array[array.length-1].fullName = decodeURI(objects[i].file.fullName);
            array[array.length-1].name = decodeURI(objects[i].file.name);
            array[array.length-1].path = decodeURI(objects[i].file.path);
        }
    }
    /*
    if(array.length < 1){
        alert("nothing you selected image");
        return false;
    }
    */
    //var name = app.activeDocument.fullName.toString();
    return JSON.stringify(array);
})();