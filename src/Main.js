import { MenuTop } from './MenuTop.js';
import { MenuThree } from './MenuThree.js';
import { GameAsteroid } from './game/GameAsteroid.js';
import { PlayableHomescapes } from './game/PlayableHomescapes.js';

export class Main  {
  	constructor(fun) {  		
  		var self=this;
  		this.type="Main";
  		this.fun=fun;

  		this._width = 0;
  		this._height = 0;

  		this.offset = 5;
		this.contentHTML= document.createElement('div');
		this.contentHTML.style.position = 'fixed';
		this.contentHTML.style.top = '0px';
		this.contentHTML.style.left = '0px';
		document.body.appendChild(this.contentHTML); 

		this.dCont = new DCont(this.contentHTML)

		this.mTop = undefined;
		this.arrayComponents = [];
  		this.init = function () {
  			this.viewLink = new ViewLink(this, function(){
  			})

  			this.mTop = new MenuTop(this, function(){
  			})
  			// this.mThree = new MenuThree(this, function(){
  			// })
  			this.arrayComponents.push(this.gAsteroid = new GameAsteroid(this, function(){ }))
  			this.gAsteroid.init()
  			// this.arrayComponents.push(this.pHomescapes = new PlayableHomescapes(this, function(){ }))

  			fun("init")
		};

		var s, w, h;		
		this.scale=1;
  		this.sizeWindow = function(_w, _h){  			
  			if(_w) {
  				w = _w;
  				h = _h;
  			}
  			self._width=w;
			self._height=h;
			s= w/self._width;
			if(s>h/self._height)s=h/self._height;
			this.scale = s;
			if(dcmParam.isIE==true)this.scale = 1;	

			if(this.mTop == undefined) return
			this.mTop.sizeWindow(w, h, this.scale)

			for (var i = 0; i < this.arrayComponents.length; i++) {
				this.arrayComponents[i].sizeWindow(w, h, this.scale)
			}


			// this.mThree.sizeWindow(w, h, this.scale)
			// this.mThree.y = this.mTop.height
  		} 

  		this.init()
  	}

}

export class ViewLink  {
  	constructor(par, fun) {
  		var self=this;
  		this.type="ViewLink";
  		this.par=par;
  		this.fun=fun;

		this.params = new URL(location.href).searchParams;
		// const year = params.get('year');
		// window.location.search

  		this.searchPage = function(){
  			//# TODO хз
  		}

  		this.getPage = function(){
  			//# TODO выключаем всё и включаем нужный класс visible
  		}
  		this.setPage = function(){
  			//# TODO добавляем линк на страницу в вин.хистори
  		}
  	}
}
/*
        this.parseLink=function(){
            // setTimeout(function() {
                var key= mhbd.getURLParameters("key")
                var type= mhbd.getURLParameters("type")
                var page= mhbd.getURLParameters("page")
                var id= mhbd.getURLParameters("id")


                // if(type==null)return;
                if(key==null)return;

                if(type)if(type.toLowerCase()=="creat"){
                    if(id)
                    mhbd.getKeyId(key,id,function(obj, er){
                        self.fun("openLeftField", key+"List")
                        self.par.setSob(key+"Creat", obj);
                        // self.fun("openLeftField", key+"Creat")
                    })
                }

                if(type)if(type.toLowerCase()=="list"){
                    if(page){
                        self.par.mcLoad.page = (page*1)-1;
                    }
                    self.fun("openLeftField", key+"List")
                    self.par.setSob(key+"List");

                    self.par.mcLoad.page = 0;
                }

                if(type==undefined){
                    self.fun("openLeftField", key)
                    self.par.setSob(key);
                }

            // }, 1);
        }
*/