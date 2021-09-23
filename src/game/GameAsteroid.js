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
  		this.type="MThree";
  		this.par=par;
  		this.fun=fun;

  		this._width = 800;
  		this._height = 600;
  		this._x = 0;
  		this._y = 0;
		// this.dCont = new DCont(this.par.contentHTML); 
		// document.body.style.cursor = 'none';

		const AMOUNT_OF_ASTROIDES = 10; 
		const AMOUNT_OF_DECK = 2; 

		this.init = function(){
			if(this.game != undefined) return
			var config = {
			    type: Phaser.AUTO,
			    parent: this.par.contentHTML,
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
		}

		var path = "../../resources/"
	    function preload() {  
		    this.load.image('asteroid', path+'asteroid2.png');
		    this.load.image('star', path+'star2.png');
		    this.load.image('bullet', path+'bullet.png');
		    this.load.image('spaceship', path+'pngegg.png');
		    this.load.scenePlugin('WeaponPlugin', '../../lib/WeaponPlugin.js', null, 'weapons');
		}


	    function create() {
			this.background = this.add.graphics();
			this.background.fillRect(0, 0, this.scale.width, this.scale.height);
			this.background.fillGradientStyle(0x161636, 0x161636, 0x292963, 0x292963);

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

			this.players = this.physics.add.group();
			this.asteroids = this.physics.add.group();

			this.player = new Player(this, 320, 240);
			self.asteroidGenerator(this)

			this.input.on("pointerdown", function(){
				this.player.sprite.weapon.fireAtPointer();
			},  this)

		    var debug = this.add.graphics();
		    debug.lineStyle(1, 0x808080);
			this.input.on('pointermove', function (pointer) {
		        debug.clear();

				debug.beginPath();
				debug.arc(pointer.worldX, pointer.worldY, 25, 0, 2 * Math.PI);
				debug.moveTo(pointer.worldX+25, pointer.worldY);
				debug.lineTo(pointer.worldX-25, pointer.worldY);
				debug.moveTo(pointer.worldX, pointer.worldY+25);
				debug.lineTo(pointer.worldX, pointer.worldY-25);
				debug.stroke();
		    }, this);

			this.physics.add.collider(this.asteroids)
			this.physics.add.collider(this.asteroids, this.players, death, null, this)
			this.physics.add.collider(this.asteroids, this.player.sprite.weapon.bullets, oneShotOneKill, null, this);
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
					createAsteroid(x, y, Math.round(scale)/3, scale, par.asteroids);
				}
        	}
		}

		var asteroid;
	    function createAsteroid(x, y, scale, hp, par) {
	        asteroid = par.create(x, y, 'asteroid').setOrigin(1, 1).setImmovable(false);
	        asteroid.setScale(scale);
	        asteroid.setBounce(1,1);
	        asteroid.setVelocity(Phaser.Math.Between(-25, 25), Phaser.Math.Between(-25, 25));
	        asteroid.setMaxVelocity(50);
	        asteroid.setCircle(50);	
	        asteroid.setMass(1);
	        asteroid.hp=hp;
	    }


	    function death(player, asteroid) {
			this.registry.destroy();
			this.events.off();
			this.scene.restart();
	    }

	    var num = 2;
	    function oneShotOneKill(bullet, asteroid) {
	    	trace(bullet, asteroid)

	    	bullet.setActive(false).setVisible(false);
	        bullet.body.enable = false;
	        bullet.kill();
			
			asteroid.hp--
        	asteroid.setActive(false).setVisible(false);
        	asteroid.body.enable = false;

        	if(asteroid.hp > 0){
	        	for (var i = 0; i < num; i++) {
	        		createAsteroid(asteroid.x, asteroid.y, Math.round(asteroid.hp)/3, asteroid.hp, this.asteroids);
	        	}
        	}

			asteroid.destroy()
			self.asteroidGenerator(this)
	    }


	    function update() {
	        this.player.update();
    
	        this.physics.world.wrap(this.player.sprite, 0);
			if(this.asteroids.children)this.physics.world.wrap(this.asteroids, 0);
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
}





export default class Player {
    constructor(scene, x, y) {
    	var self = this;
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
            alpha: 0.2,
            duration: 100,
            yoyo: true,
            repeat: 5,
            ease: 'Power1',
        });

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
                sprite.weapon.fire();
            }


            if (scene.controls.keys.up.isDown || scene.controls.keys.w.isDown) {
                sprite.setDrag(0.98);
                scene.physics.velocityFromAngle(sprite.angle, 50, sprite.body.acceleration);
            } else {
                sprite.body.setAcceleration(0);
            }

            if ((scene.controls.keys.down.isDown || scene.controls.keys.s.isDown)) {
                sprite.setDrag(0.92);
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