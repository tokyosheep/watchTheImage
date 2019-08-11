
/*
var obj = {
    isResize:true,
    path:"~/Desktop/testWatch/test.ai",
    resize:50
}
trigger(obj);
*/
function trigger(obj){
    var filePath = new File(obj.path);
    try{
        app.open(filePath);
        if(obj.isResize){
            resize(obj);
        }else{
            PDF(filePath);
        }
        return true;
    }catch(e){
        return false;
    }
}

function unlockItems(){
    layerUnlock(activeDocument.layers);
    var p = activeDocument.pageItems;
    for(var i=0;i < p.length;i++){
        try{
            //p[i].selected = true;
        }catch(e){
            p[i].locked = false;
            //p[i].selected = true;
        }
    }
    function layerUnlock(lay){
        for(var i=0;i<lay.length;i++){
            lay[i].locked = false;
            $.writeln(lay[i].layers.length);
            if(lay[i].layers.length > 0){
                layerUnlock(lay[i].layers);
            }
        }
    }
}

function resize(obj){
    //saveAIdata(activeDocument.fullName);
    unlockItems();
    app.executeMenuCommand("selectall");//メニューコマンド実行
    app.executeMenuCommand("group");
    app.selection[0].resize(obj.resize,obj.resize);
    fitArtBoard();
    PDF(activeDocument.path+"/resize"+activeDocument.name);
    activeDocument.close(SaveOptions.DONOTSAVECHANGES);  
}

function PDF(path){
    var savePath = new File(path);
    var option = new PDFSaveOptions();
    option.compatibility = PDFCompatibility.ACROBAT7;
    activeDocument.saveAs(savePath,option);
    activeDocument.close(SaveOptions.DONOTSAVECHANGES); 
}

function fitArtBoard(){
    app.executeMenuCommand("selectallinartboard");
    var flag = activeDocument.fitArtboardToSelectedArt(0);
    if(!flag){
        alert("there's no any artboard");
        return false;
    }else{
        return true;
    }
}