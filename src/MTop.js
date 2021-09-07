export class MTop  {
  	constructor(par, fun) {  		
  		var self=this;
  		this.type="Main";
  		this.par=par;
  		this.fun=fun;
		this.dCont = new DCont(this.par.contentHTML);

		this._width = 0;
  		this._height = 0;
  		this._x = 0;
  		this._y = 0;

		this.panel = undefined;
  		this.init = function () {
			this.panel = new DPanel(this.dCont, 0, 0)
			this.panel.height = 32

			this.panel.color = '#00ff00'

			this._height = this.panel.height;
		};


		var w,h,s;
  		this.sizeWindow = function(_w, _h, _s){  			
  			if(_w) {
  				w = _w;
  				h = _h;
  				s = _s;
  			}
  			self.width=w;

			if(!this.panel) return
			this.panel.width = self._width;
			this.panel.height = self._height;
  		} 

  		this.init()
  	}
  	set height(value) {
        if (this._height != value) {
            this._height = value;              
            this.sizeWindow()              
        }             
    }
    get height() { return this._height; }

    set width(value) {
        if (this._width != value) {
            this._width = value;   
            this.sizeWindow()                         
        }             
    }
    get width() { return this._width; }

    set x(value) {
        if (this._x != value) {
            this._x = value;                   
            this.dCont.x = this._x;         
        }             
    }
    get x() { return this._x; }

  	set y(value) {
        if (this._y != value) {
            this._y = value;                            
            this.dCont.y = this._y;         
        }             
    }
    get y() { return this._y; }
}

