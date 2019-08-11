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
    const isResize = document.getElementById("isResize");
    const resize = document.getElementById("resize");
    
    const chokidar = require("chokidar");
    let watcher = null;//最初にwatcher自体にnullを代入しないとcloseメソッドが正常に動かないよう
    
    const dir_home = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
    const dir_desktop = require("path").join(dir_home, "Desktop");
    
    isResize.addEventListener("click",()=>{
        resize.disabled = !isResize.checked;
    });
    
    watch_on.addEventListener("click",()=>{
        const whichImg = document.getElementsByClassName("whichImg");
        const index = Array.from(whichImg).findIndex(v=> v.checked === true);
        if(index === -1){
            alert("配置画像が選択されていません。");
            return;
        }
        const filePath = whichImg[index].dataset.fullName.replace("~/Desktop",dir_desktop);
        //Adobe　scriptだとdesktopパスは~Desktop/と取得するがCEp上だと正常に認識してくれないためnodeからdesktopパスを取得し直して置き換える必要がある。
        watchIngFile(filePath);
        console.log(watcher);
        alert("watch start");
    });
    
    
    watchOut.addEventListener("click",()=>{
        watcher.close();
        console.log(watcher);
        alert("watch stop");
    });
    
    function watchIngFile(filePath){
        const log = console.log.bind(console);
        console.log(filePath);
        watcher = chokidar.watch(filePath,{
            persistent:true,
        });
        watcher
        .on("add",path => {log(`the file is added${path}`); 
            afterTriggered();
        })
        .on("change",path => {log(`the file was changed${path}`); 
            afterTriggered();                     
        })
        .on("unlink",path => {log(`the file was removed ${path}`)
            afterTriggered();                     
        });
    }
    
    function afterTriggered(){
        console.log(AIpath.dataset.fullname);
        const obj = {
            path:AIpath.dataset.fullname,
            isResize:isResize.checked,
            resize:resize.value
        }
        console.log(obj);
        csInterface.evalScript(`trigger(${JSON.stringify(obj)})`);
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
            _input.classList.add("whichImg");
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
    
