
export class PlayableHomescapes  {
  	constructor(par, fun) {  		
  		var self=this;
  		this.type="PlayableHomescapes";
  		this.par=par;
  		this.fun=fun;

  		this._width = 800;
  		this._height = 600;
  		this._x = 0;
  		this._y = 0;
  		this._visible = null;

  		this.offset = this.par.offset;
		this.dCont = new DCont(this.par.dCont); 


/////////////////////////////////////////////////////////

        var app = new PIXI.Application({
            width: document.documentElement.clientWidth, 
            height: document.documentElement.clientHeight, 
            resolution: window.devicePixelRatio || 1,
            resizeTo: window
        });
        PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST

        this.dCont.div.appendChild(app.view);
        var content = new PIXI.Container();
        var back = new PIXI.Container();
        var elements = new PIXI.Container();
        // var cover = new PIXI.Container();


        app.stage.addChild ( content )
        content.addChild( back, elements)

        app.loader.baseUrl = "../../resources/game/PlayableHomescapes/"
        app.loader
            .add('all', 'texturePacker/all-0.json') 
            .add('bg', 'texturePacker/bg.json')
            .load(createResourcces);

        var arrElements = []
        var background, dec, austin
        var dec1, stair
        function createResourcces() {
            var resources = app.loader.resources;
            var all = resources.all.textures;
            var bg = resources.bg.textures;

            var textureButton = all['notActiveBut.png'];
            var textureButtonDown = all['activeBut.png'];


            arrElements.push( background = new PIXI.Sprite(bg['back.png']) )
            arrElements.push( dec = new PIXI.Sprite(all['dec_2.png']) )
            arrElements.push( austin = new PIXI.Sprite(all['Austin.png']) )
            back.addChild( background, dec, austin )

            arrElements.push( stair = new PIXI.Sprite(all['old_stair.png']) )
            arrElements.push( dec1 = new PIXI.Sprite(all['dec_1.png']) )


            var btn, bg, stairButtons = []
            for (let i = 1; i < 4; i++) {
                btn = new PIXI.Sprite(textureButton);
                bg = new PIXI.Sprite(all[`but_stair_${i}.png`]);

                // bg = this.menu.getChildByPath<PIXI.Sprite>(`stair-${i}-btn:selected`);
                bg.x = btn.x = (btn._texture.trim.width)*i;
                bg.anchor.x = btn.anchor.x = 0.5;
                var index = i;

                trace('btn.width', btn._texture.trim.width)

                btn.on("pointerdown", () => {
                    trace(index)
                    // this.selectStair(index);
                })
                stairButtons.push( { btn, bg })
                // this.stairButtons.push({ btn, bg });
            }


            // var btn, bg
            // for (let i = 0; i < 3; i++) {
            //     btn = new PIXI.Sprite(all1['menu.png']);
            //     // bg = this.menu.getChildByPath<PIXI.Sprite>(`stair-${i}-btn:selected`);

            //     btn.x += btn.width * 0.5;
            //     btn.anchor.x = 0.5;
            //     var index = i;
            //     btn.on("pointerdown", () => {
            //         trace(index)
            //         // this.selectStair(index);
            //     })
            //     // this.stairButtons.push({ btn, bg });
            // }

            elements.addChild( stair, dec1 )
            stairButtons.forEach((p, k) => {
                elements.addChild(p.btn, p.bg)
                // p.bg.visible = k === index;
            });

            for (var i = 0; i < arrElements.length; i++) {
                arrElements[i].anchor.set(0.5);
            }

            self.sizeWindow()
        }


        var ss;
        function setSize(w, h){
            ss = (w) / content.width;
            if (ss > (h) / content.height) ss = (h) / content.height;

            content.width = content.width*ss;
            content.height = content.height*ss;

            content.x = app.screen.width / 2;
            content.y = app.screen.height / 2;
        }

// dude.interactive = true;
// dude.buttonMode = true;

// dude.on('pointertap', () => {
//     bol = !bol;
//     if (bol) {
//         dude.texture = secondTexture;
//     } else {
//         dude.texture = texture;
//     }
// });
        // initPixi()
        // function initPixi() {
        //     requestAnimationFrame(initPixi);
        //     renderer.render(back)
        // }

		/* this.init = function(){
			if(this.game != undefined) return
			this.game = true;
            trace("INIT")
            var resources = app.loader.resources;
            trace(resources)
            // var resources1 = PIXI.loader.resources[ path+"texturePacker/all1-0.json".textures ]
            // var resources2 = PIXI.loader.resources[ path+"texturePacker/all1-1.json".textures ]
            // trace(resources1)

            // var sprite = new PIXI.Sprite( resources1["Austin.png"] )
            // app.stage.addChild(sprite);
		} */


		var w,h,s;
  		this.sizeWindow = function(_w, _h, _s){
  			if(_w) {
  				w = _w;
  				h = _h;
  				s = _s;
  			}
  				
  			self._width=w;
			self._height=h;

            setSize(w, h)
  		} 

  		// this.init()
  	}

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

  	set visible(value) {
        if (this._visible != value) {
            this._visible = value; 

            if(this._visible == true) {
  				this.init()
            	this.par.dCont.add(this.dCont)    
            } else {
            	if(this.dCont.parent!=undefined) this.dCont.parent.remove(this.dCont);
            }
        }             
    }
    get visible() { return this._visible; }
}

