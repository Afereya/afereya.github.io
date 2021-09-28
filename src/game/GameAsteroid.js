// import * as THREE from '../lib/three.module.js';
// import * as PIXI from '../lib/pixi.min.js';
// import * as Phaser from '../lib/phaser.min.js';

// import { OrbitControls } from '../lib/OrbitControls.js';

// import Stats from './jsm/libs/stats.module.js';
// import { GUI } from './jsm/libs/dat.gui.module.js';
// import { OrbitControls } from './jsm/controls/OrbitControls.js';

import phaserControls from '../../lib/phaserControlsPlugin.min.js';
export class GameAsteroid  {
  	constructor(par, fun) {  		
  		var self=this;
  		this.type="GameAsteroid";
  		this.par=par;
  		this.fun=fun;

  		this._width = 800;
  		this._height = 600;
  		this._x = 0;
  		this._y = 0;
  		this._visible = null;

  		this.offset = this.par.offset;
		this.dCont = new DCont(this.par.dCont); 

		// this.visible = true;
		// this.visible = false;

		// document.body.style.cursor = 'none';

		const AMOUNT_OF_ASTROIDES = 10; 
		// const AMOUNT_OF_DECK = 2; 

		this.init = function(){
			if(this.game != undefined) return
			var config = {
			    type: Phaser.AUTO,
			    parent: this.dCont.div,
			    scale: {
			        mode: Phaser.Scale.RESIZE,
			        width: '100%',
			        height: '100%'
			    },
			    physics: {
			        default: "arcade",
			        arcade: {
			        	debug: false,
			            gravity: { x: 0, y: 0 }
			        }
			    },
		        plugins: {
			        scene: [
			            { key: 'phaserControls', plugin: phaserControls, mapping: 'controls' }
			        ]
			    },
			    scene: {
			        preload: preload,
			        create: create,
			        update: update
			    }
			};

			this.game = new Phaser.Game(config);
			this.textBuff = new DLabel(this.dCont, this.offset, this.offset, ' ')
			this.textBuff.width = this._width;
			this.textBuff.activMouse = false;

			this.textWarning = new DLabel(this.dCont, this.offset, this.offset+this.textBuff.fontSize, ' ')
			this.textWarning.width = this._width;
			this.textWarning.activMouse = false;
		}


		var path = "../../resources/"//game/GameAsteroid/"
	    function preload() {  
		    this.load.image('asteroid', path+'asteroid2.png');
		    this.load.image('star', path+'star2.png');
		    this.load.image('bullet', path+'bullet.png');
		    this.load.image('spaceship', path+'pngegg.png');
		    this.load.image('buff1', path+'buff1.png');
		    this.load.image('buff2', path+'buff2.png');
		    this.load.image('buff3', path+'buff3.png');
		    this.load.scenePlugin('WeaponPlugin', '../../lib/WeaponPlugin.js', null, 'weapons');
		}

	    var camArray = [];
	    var cam1, cam2, cam3, cam4;
	    var deathCollider, sheldCollider;
	    function create() {
	    	// const gui = new dat.GUI();
			this.cameras.main.setSize(this.scale.width, this.scale.height)
			this.cameras.main.setBackgroundColor(0x292963);
			camArray.push(cam1 = this.cameras.add(0, 0, this.scale.width, this.scale.height));
	        camArray.push(cam2 = this.cameras.add(0, 0, this.scale.width, this.scale.height));
	        camArray.push(cam3 = this.cameras.add(0, 0, this.scale.width, this.scale.height));

			// this.background = this.add.graphics();
			// this.background.fillRect(0, 0, this.scale.width, this.scale.height);
			// this.background.fillGradientStyle(0x161636, 0x161636, 0x292963, 0x292963);

			var star;
			var bg = this.add.group();
			for (var i = 0; i < 50; i++) {
	       		star = bg.create(Phaser.Math.Between(0, this.scale.width), Phaser.Math.Between(0, this.scale.height), 'star');
	        	star.setScale( Phaser.Math.Between(1, 100) /100 );
	        	star.setAlpha( Phaser.Math.Between(10, 30) /100 );
			}

			this.controls.createCursorKeys(true)
	        this.controls.add({
	            name: 'cursorCustom',
	            active: true,
	            controls: {
	                up: 'UP',
	                down: 'DOWN',
	                left: 'LEFT',
	                right: 'RIGHT',
	                space: 'SPACE',
	                autofire: 'F',
	                w: 'W',
	                a: 'A',
	                s: 'S',
	                d: 'D',
	            }
	        });
	        this.controls.createWasdKeys();

			this.buffs = this.physics.add.group();
			this.arrayBuff = { 
				'1': {name: 'Power shield'},
				'2': {name: 'Homing missile'},
				'3': {name: 'Btooom'}
			};

			this.players = this.physics.add.group();
			this.asteroids = this.physics.add.group();

			this.player = new Player(self, this, Phaser.Math.Between(0, this.scale.width), Phaser.Math.Between(0, this.scale.height));
			this.cameras.main.startFollow(this.player.sprite, true, 1, 1)
			self.asteroidGenerator(this)

			this.input.mouse.disableContextMenu();
			this.input.on("pointerdown", function(pointer){
				// // this.player.sprite.weapon.fireAtPointer();
				// this.player.sprite.weapon.fireAtXY(pointer.worldX, pointer.worldY);
				if (pointer.rightButtonDown()){
					castBuff(this, this.player.getBuff())
				} else {
					this.player.sprite.weapon.fireAtXY(pointer.worldX, pointer.worldY);
				}
			}, this)


		    var reticle = this.add.graphics();
		    reticle.lineStyle(1, 0x808080);
			this.input.on('pointermove', function (pointer) {
		        reticle.clear();
				reticle.beginPath();
				reticle.arc(pointer.worldX, pointer.worldY, 25, 0, 2 * Math.PI);
				reticle.moveTo(pointer.worldX+25, pointer.worldY);
				reticle.lineTo(pointer.worldX-25, pointer.worldY);
				reticle.moveTo(pointer.worldX, pointer.worldY+25);
				reticle.lineTo(pointer.worldX, pointer.worldY-25);
				reticle.stroke();
		    }, this);

			this.pace = 1000;
			this.physics.add.collider(this.asteroids)
			this.physics.add.collider(this.asteroids, this.player.sprite.weapon.bullets, oneShotOneKill, null, this);
			deathCollider = this.physics.add.collider(this.asteroids, this.players, death, null, this);
			deathCollider.active = true

			sheldCollider = this.physics.add.overlap(this.asteroids, this.players, survive, null, this);
			sheldCollider.active = false

			this.physics.add.overlap(this.buffs, this.player.sprite, buffApply, null, this);
		}


		var dist
		this.asteroidGenerator=function(par){
			if(par.asteroids.getChildren().length < AMOUNT_OF_ASTROIDES) {
				for (var i = par.asteroids.getChildren().length; i < AMOUNT_OF_ASTROIDES; i++) {
					let scale = Phaser.Math.Between(1, 2);
					let x = Phaser.Math.Between(0, this.game.scale.width);
					let y = Phaser.Math.Between(0, this.game.scale.height);
					dist = Phaser.Math.Distance.Between(par.player.sprite.x, par.player.sprite.y, x, y)
					if(dist < 200) {
						i --
						continue
					}
					createAsteroid(x, y, Math.round(scale)/3, scale, par);
				}
        	}
		}


		var asteroid;
	    function createAsteroid(x, y, scale, hp, par) {
	        asteroid = par.asteroids.create(x, y, 'asteroid').setOrigin(1, 1).setImmovable(false);
	        asteroid.asteroid='asteroid';
	        asteroid.setScale(scale);
	        asteroid.setBounce(1,1);
	        asteroid.setVelocity(Phaser.Math.Between(-25, 25), Phaser.Math.Between(-25, 25));
	        asteroid.setMaxVelocity(50);
	        asteroid.setCircle(50);	
	        asteroid.hp=hp;

	        par.add.tween({
			  targets: asteroid,
			  duration: 1000,
			  alpha: {
			  	    getStart: () => 0,
    				getEnd: () => 1
			  }
			});
	    }


	    function death() {
			this.player.setBuff(null)
			this.registry.destroy();
			this.events.off();
			this.scene.restart();
	    }


	    var num = 2;
	    function oneShotOneKill(bullet, asteroid) {
	    	bullet.setActive(false).setVisible(false);
	        bullet.body.enable = false;
	        bullet.kill();
			
			asteroid.hp--
        	asteroid.setActive(false).setVisible(false);
        	asteroid.body.enable = false;

        	if(asteroid.hp > 0){
	        	for (var i = 0; i < num; i++) {
	        		createAsteroid(asteroid.x, asteroid.y, Math.round(asteroid.hp)/3, asteroid.hp, this);
	        	}
        	}

			self.buffsRandom(this, asteroid.x, asteroid.y)
			asteroid.destroy()
			self.asteroidGenerator(this)
	    }


		var buff;
	    this.buffsRandom = function(par, x, y){
	    	let min = 0;
	    	let max = Phaser.Math.Between(0, 3);
			let type = Math.floor(Math.random() * (max - min + 1)) + min;
			if(type == 0) return;

			buff = par.buffs.create(x, y, 'buff'+type).setOrigin(1, 1).setImmovable(false);
	        buff.setScale(0.2);
	        buff.setAlpha(0.9);
	        buff.type=type;
	    }

	    var btoomRadius = 100;
	    function buffApply(player, buff) {
			buff.destroy();
			this.player.setBuff(buff.type)
	    }


	    function castBuff(par, type) {
	    	if(type === null) return;
	    	if(par.pace < 1000) {
	    		self.textWarning.value = 'Нельзя применять способности так часто!'
	    		self.textWarning.visible = true;

	    		par.add.tween({
				  targets: self.textWarning,
				  duration: 2500,
				  alpha: {
				  	    getStart: () => 10,
	    				getEnd: () => 0
				  }
				});
	    		return
	    	} else {
	    		self.textWarning.visible = false;
	    	}
	    	par.pace = 0;

			if(type == 1) {
				deathCollider.active = false;
				sheldCollider.active = true;
			}

			if(type == 2) {
				asteroitInteractiveOn(par)
		        par.input.on('gameobjectup', function (pointer, gameObject)
		        {
					par.player.sprite.weapon.fireAtSprite(gameObject);
					par.input.off('gameobjectup')
					asteroitInteractiveOff(par)

		        }, par);
			}

			if(type == 3){
				var bodies = par.physics.overlapRect(par.player.sprite.x-(btoomRadius/2), par.player.sprite.y-(btoomRadius/2), par.player.sprite.x+(btoomRadius/2), par.player.sprite.y+(btoomRadius/2));

				bodies.forEach(function (element) {
					if(element.gameObject !== undefined && element.gameObject !== null){
						if(element.gameObject.asteroid !== undefined) {
	    					element.gameObject.setActive(false).setVisible(false);
					        element.destroy()
						}
					}

		        	setTimeout(function(){
						self.asteroidGenerator(par)
		        	}, 100);
			    });
			}

			par.player.setBuff(null)
	    }


	    function asteroitInteractiveOn(par) {
	    	let arr = par.asteroids.getChildren()
	    	for (var i = arr.length - 1; i >= 0; i--) {
	    		arr[i].setInteractive()
	    	}
	    }

	    function asteroitInteractiveOff(par) {
	    	let arr = par.asteroids.getChildren()
	    	for (var i = arr.length - 1; i >= 0; i--) {
	    		arr[i].disableInteractive()
	    	}
	    }

	    function survive() {
        	setTimeout(function(){
        		deathCollider.active = true;
				sheldCollider.active = false;
        	}, 1000);
	    }

	    function update() {
	    	this.pace++;
	        this.player.update();
    
	        this.physics.world.wrap(this.player.sprite, 0);
	        if(this.player.sprite.weapon.bullets.children)this.physics.world.wrap(this.player.sprite.weapon.bullets, 0);
			if(this.asteroids.children)this.physics.world.wrap(this.asteroids, 0);

        	cam1.scrollY = this.cameras.main.scrollY;
			if(this.cameras.main.scrollX > 0) cam1.scrollX = -this.scale.width+this.cameras.main.scrollX;
			if(this.cameras.main.scrollX < 0) cam1.scrollX = this.scale.width+this.cameras.main.scrollX;
			if(this.cameras.main.scrollX == 0) cam1.visible = false;

	        cam2.scrollX = this.cameras.main.scrollX;
			if(this.cameras.main.scrollY > 0) cam2.scrollY = -this.scale.height+this.cameras.main.scrollY;
 			if(this.cameras.main.scrollY < 0) cam2.scrollY = this.scale.height+this.cameras.main.scrollY;
			if(this.cameras.main.scrollY == 0) cam2.visible = false;

			cam3.scrollX = cam1.scrollX
			cam3.scrollY = cam2.scrollY
			if(this.cameras.main.scrollX == 0 && this.cameras.main.scrollY == 0)cam3.visible = false;
	    }


		var w,h,s;
  		this.sizeWindow = function(_w, _h, _s){  			
  			if(_w) {
  				w = _w;
  				h = _h;
  				s = _s;
  			}
  				
  			self._width=w;
			self._height=h;
  		} 

  		this.init()
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



export class Player {
    constructor(par, scene, x, y) {
    	var self = this;
        this.par = par;
        this.scene = scene;

        this.sprite = scene.players.create(x, y, "spaceship").setScale(0.6, 0.6).setOrigin(0.5, 0.5).setImmovable(true);
        this.sprite.setSize(100, 100, false);
        this.sprite.setDamping(true);
        this.sprite.setDrag(1);
        this.sprite.body.setMaxVelocity(200);

        this.sprite.autoFire = false;
        this.sprite.bulletMax = 10;
        this.sprite.weapon = scene.weapons.add(this.sprite.bulletMax, 'bullet');
        this.sprite.weapon.bulletKillType = WeaponPlugin.consts.KILL_LIFESPAN;
        this.sprite.weapon.bulletLifespan = 5000;
        this.sprite.weapon.bulletSpeed = 150;
        this.sprite.weapon.fireRate = 1000;

        this.sprite.weapon.bullets.children.each(function (bullet) {
            bullet.body.setImmovable(true);
            bullet.setScale(0.4, 0.3);
        }, this);
        this.sprite.weapon.trackSprite(this.sprite, 0, 0, true);

        this.sprite.hitTween = scene.tweens.add({
            targets: this.sprite,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: 5,
        });

        this.buff = null;
        this.setBuff = function(type){
        	if(type === null) this.par.textBuff.value = ' '
        	else this.par.textBuff.value = 'Active buff: ' + this.scene.arrayBuff[type+''].name;
        	this.buff = type;
        }

        this.getBuff = function(){
			return this.buff;
        }
    }

    create() {
    }

    update() {
        let scene = this.scene;
        let sprite = this.sprite;
        let controls = scene.controls;

        if(sprite.active) {
            if(Phaser.Input.Keyboard.JustDown(controls.keys.autofire)) {
                if(sprite.autoFire) {
                    sprite.autoFire = false;
                } else {
                    sprite.autoFire = true;
                }
            }

            if (scene.controls.keys.space.isDown || sprite.autoFire) {
				sprite.weapon.fireAtXY(scene.input.mousePointer.worldX, scene.input.mousePointer.worldY);
            }


            if (scene.controls.keys.up.isDown || scene.controls.keys.w.isDown) {
                sprite.setDrag(0.98);
                scene.physics.velocityFromAngle(sprite.angle, 50, sprite.body.acceleration);
            } else {
                sprite.body.setAcceleration(0);
            }

            if ((scene.controls.keys.down.isDown || scene.controls.keys.s.isDown)) {
                sprite.setDrag(0.98);
                scene.physics.velocityFromAngle(sprite.angle, -50, sprite.body.acceleration);
            }

            if (scene.controls.keys.left.isDown || scene.controls.keys.a.isDown) {
                sprite.angle = sprite.angle - 1;
            } else if (scene.controls.keys.right.isDown || scene.controls.keys.d.isDown) {
                sprite.angle = sprite.angle + 1;
            } else {
                sprite.setAngularVelocity(0);
            }
        }
    }
}