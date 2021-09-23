import { MenuTop } from './MenuTop.js';
import { MenuThree } from './MenuThree.js';
import { GameAsteroid } from './game/GameAsteroid.js';

export class Main  {
  	constructor(fun) {  		
  		var self=this;
  		this.type="Main";
  		this.fun=fun;

  		this._width = 0;
  		this._height = 0;

		this.contentHTML= document.createElement('div');
		this.contentHTML.style.position = 'fixed';
		this.contentHTML.style.top = '0px';
		this.contentHTML.style.left = '0px';
		document.body.appendChild(this.contentHTML); 

		this.mTop = undefined;
  		this.init = function () {
  			this.mTop = new MenuTop(this, function(){
  			})
  			// this.mThree = new MenuThree(this, function(){
  			// })
  			 this.gAsteroid = new GameAsteroid(this, function(){
  			})
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
			this.gAsteroid.sizeWindow(w, h, this.scale)

			// this.mThree.sizeWindow(w, h, this.scale)
			// this.mThree.y = this.mTop.height
  		} 

  		this.init()
  	}

}

