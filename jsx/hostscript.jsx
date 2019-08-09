/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/


function sayHello(){
    alert("hello from ExtendScript");
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
    resizeExport(obj);
}

    function resizeExport(obj){
        saveAIdata(activeDocument.fullName);
        unlockItems();
        app.executeMenuCommand("selectall");//メニューコマンド実行
        app.executeMenuCommand("group");
        app.selection[0].resize(obj.resize,obj.resize);
        fitArtBoard();
        PDF(activeDocument.path+"/resize"+activeDocument.name);
        activeDocument.close(SaveOptions.DONOTSAVECHANGES);  
    }
}

function PDF(path){
    var savePath = new File(path);
    var option = new PDFSaveOptions();
    option.compatibility = PDFCompatibility.ACROBAT7;
    activeDocument.saveAs(savePath,option);
}