window.onload = () =>{
    "use strict";
    const csInterface = new CSInterface();
    themeManager.init();
    const filePath = csInterface.getSystemPath(SystemPath.EXTENSION) +`/js/`;
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    csInterface.evalScript(`$.evalFile("${extensionRoot}json2.js")`);//json2読み込み
    
    const imgForm = document.forms.images;
    const watch_on = document.getElementById("watch");
    const watchOut = document.getElementById("watchOut");
    const getAIFile = document.getElementById("getAIFile");
    const getPlaces = document.getElementById("getPlaces");
    const AIpath = document.getElementById("AIpath");
    const placeImgList = document.getElementById("placeImgList");
    const chokidar = require("chokidar");
    const watcher = chokidar.watch(`${extensionRoot}seem.txt`,{
        persistent:true,
    });
    
    watch_on.addEventListener("click",()=>{
        console.log(imgForm.img);
        watcher.add(`${extensionRoot}seem.txt`);
        watchIngFile();
        console.log(watcher);
    });
    
    watchOut.addEventListener("click",()=>{
        watcher.close();
        console.log(watcher);
    });
    
    function watchIngFile(){
        const log = console.log.bind(console);
        watcher
        .on("add",path => log(path))
        .on("change",path => log(path))
        .on("unlink",path => log(path))
    }
    
    function getPlacedImg(){
        return new Promise((resolve,reject)=>{
            csInterface.evalScript(`$.evalFile("${extensionRoot}getReplaceImg.jsx")`,(o)=>{
                if(!o){
                    reject(false);
                }
                const obj = JSON.parse(o);
                resolve(obj);
            });
        });
    }
    
    function getAIPath(){
        return new Promise((resolve,reject)=>{
            csInterface.evalScript(`$.evalFile("${extensionRoot}getAiPath.jsx")`,(o)=>{
                if(!o){
                    reject(false);
                }
                const obj = JSON.parse(o);
                resolve(obj);
            });
        })
    }
    
    function removeChildren(parent){
        while(parent.firstChild){
            parent.removeChild(parent.firstChild);
        }
    }
    
    
    getAIFile.addEventListener("click",()=>{
        (async()=>{
            const pathData = await getAIPath();
            console.log(pathData);
            AIpath.dataset.path = pathData.path;
            AIpath.dataset.name = pathData.name;
            AIpath.dataset.fullname = pathData.fullName;
            AIpath.textContent = pathData.name;
        })();
    });
    
    class WriteForms{
        constructor(btn,parent){
            this.btn = btn;
            this.parent = parent;
            this.btn.addEventListener("click",this);
        }
        
        writeRadio(object){
            const li = document.createElement("li");
            this.parent.appendChild(li);
            const label = document.createElement("label");
            label.classList.add("topcoat-radio-button");
            li.appendChild(label);
            const _input = document.createElement("input");
            _input.type = "radio";
            _input.name = "img";
            _input.dataset.path = object.path;
            _input.dataset.name = object.name;
            _input.dataset.fullName = object.fullName;
            label.appendChild(_input);
            const div = document.createElement("div");
            div.classList.add("topcoat-radio-button__checkmark");
            label.appendChild(div);
            const p = document.createElement("p");
            p.textContent = object.name;
            label.appendChild(p);
        }
        
        async handleEvent(){
            removeChildren(this.parent);
            try{
                const images = await getPlacedImg();
                console.log(images);
                images.forEach(v=>{
                    this.writeRadio(v);
                });
            }catch(e){
                return;
            }
            
        }
    }
    const forms = new WriteForms(getPlaces,placeImgList);
}
    
