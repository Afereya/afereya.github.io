import * as THREE from '../lib/three.module.js';
// import { OrbitControls } from '../lib/OrbitControls.js';

// import Stats from './jsm/libs/stats.module.js';
// import { GUI } from './jsm/libs/dat.gui.module.js';
// import { OrbitControls } from './jsm/controls/OrbitControls.js';


export class MThree  {
  	constructor(par, fun) {  		
  		var self=this;
  		this.type="Main";
  		this.par=par;
  		this.fun=fun;

  		this._width = 0;
  		this._height = 0;
  		this._x = 0;
  		this._y = 0;
		this.dCont = new DCont(this.par.contentHTML);

		let group;
		let container, stats;
		const particlesData = [];
		let camera, scene, renderer;
		let positions, colors;
		let particles;
		let pointCloud;
		let particlePositions;
		let linesMesh;

		const maxParticleCount = 1000;
		let particleCount = 500;
		const r = 800;
		const rHalf = r / 2;

		const effectController = {
			showDots: true,
			showLines: true,
			minDistance: 100,
			limitConnections: false,
			maxConnections: 30,
			particleCount: 800
		};

		init();
		animate();

		


		function init() {
			container = self.dCont.div //document.getElementById( 'container' );

			camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
			// camera.position.z = 1750;
			camera.position.z = 750;

			// const controls = new OrbitControls( camera, container );
			// controls.minDistance = 1000;
			// controls.maxDistance = 3000;

			scene = new THREE.Scene();

			var background = new THREE.Color( 0x556B2F );
			scene.background = background

			group = new THREE.Group();
			scene.add( group );

			// const helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxGeometry( r, r, r ) ) );
			// helper.material.color.setHex( 0x101010 );
			// helper.material.blending = THREE.AdditiveBlending;
			// helper.material.transparent = true;
			// group.add( helper );

			const segments = maxParticleCount * maxParticleCount;

			positions = new Float32Array( segments * 3 );
			colors = new Float32Array( segments * 3 );

			const pMaterial = new THREE.PointsMaterial( {
				color: 0xFFFFFF,
				size: 3,
				blending: THREE.AdditiveBlending,
				transparent: true,
				sizeAttenuation: false
			} );

			particles = new THREE.BufferGeometry();
			particlePositions = new Float32Array( maxParticleCount * 3 );

			for ( let i = 0; i < maxParticleCount; i ++ ) {

				const x = Math.random() * r - r / 2;
				const y = Math.random() * r - r / 2;
				const z = Math.random() * r - r / 2;

				particlePositions[ i * 3 ] = x;
				particlePositions[ i * 3 + 1 ] = y;
				particlePositions[ i * 3 + 2 ] = z;

				// add it to the geometry
				particlesData.push( {
					velocity: new THREE.Vector3( - 1 + Math.random() * 2, - 1 + Math.random() * 2, - 1 + Math.random() * 2 ),
					numConnections: 0
				} );

			}

			particles.setDrawRange( 0, particleCount );
			particles.setAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setUsage( THREE.DynamicDrawUsage ) );

			// create the particle system
			pointCloud = new THREE.Points( particles, pMaterial );
			group.add( pointCloud );

			const geometry = new THREE.BufferGeometry();

			geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
			geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setUsage( THREE.DynamicDrawUsage ) );

			geometry.computeBoundingSphere();

			geometry.setDrawRange( 0, 0 );

			const material = new THREE.LineBasicMaterial( {
				vertexColors: true,
				blending: THREE.AdditiveBlending,
				transparent: true
			} );

			linesMesh = new THREE.LineSegments( geometry, material );
			group.add( linesMesh );

			//

			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.outputEncoding = THREE.sRGBEncoding;

			container.appendChild( renderer.domElement );

			//

			// stats = new Stats();
			// container.appendChild( stats.dom );

			window.addEventListener( 'resize', onWindowResize );
		}

		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );
		}

		function animate() {
			let vertexpos = 0;
			let colorpos = 0;
			let numConnected = 0;

			for ( let i = 0; i < particleCount; i ++ )
				particlesData[ i ].numConnections = 0;

			for ( let i = 0; i < particleCount; i ++ ) {

				// get the particle
				const particleData = particlesData[ i ];

				particlePositions[ i * 3 ] += particleData.velocity.x;
				particlePositions[ i * 3 + 1 ] += particleData.velocity.y;
				particlePositions[ i * 3 + 2 ] += particleData.velocity.z;

				if ( particlePositions[ i * 3 + 1 ] < - rHalf || particlePositions[ i * 3 + 1 ] > rHalf )
					particleData.velocity.y = - particleData.velocity.y;

				if ( particlePositions[ i * 3 ] < - rHalf || particlePositions[ i * 3 ] > rHalf )
					particleData.velocity.x = - particleData.velocity.x;

				if ( particlePositions[ i * 3 + 2 ] < - rHalf || particlePositions[ i * 3 + 2 ] > rHalf )
					particleData.velocity.z = - particleData.velocity.z;

				if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
					continue;

				// Check collision
				for ( let j = i + 1; j < particleCount; j ++ ) {

					const particleDataB = particlesData[ j ];
					if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
						continue;

					const dx = particlePositions[ i * 3 ] - particlePositions[ j * 3 ];
					const dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
					const dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
					const dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

					if ( dist < effectController.minDistance ) {

						particleData.numConnections ++;
						particleDataB.numConnections ++;

						const alpha = 1.0 - dist / effectController.minDistance;

						positions[ vertexpos ++ ] = particlePositions[ i * 3 ];
						positions[ vertexpos ++ ] = particlePositions[ i * 3 + 1 ];
						positions[ vertexpos ++ ] = particlePositions[ i * 3 + 2 ];

						positions[ vertexpos ++ ] = particlePositions[ j * 3 ];
						positions[ vertexpos ++ ] = particlePositions[ j * 3 + 1 ];
						positions[ vertexpos ++ ] = particlePositions[ j * 3 + 2 ];

						colors[ colorpos ++ ] = alpha;
						colors[ colorpos ++ ] = alpha;
						colors[ colorpos ++ ] = alpha;

						colors[ colorpos ++ ] = alpha;
						colors[ colorpos ++ ] = alpha;
						colors[ colorpos ++ ] = alpha;

						numConnected ++;
					}
				}
			}


			linesMesh.geometry.setDrawRange( 0, numConnected * 2 );
			linesMesh.geometry.attributes.position.needsUpdate = true;
			linesMesh.geometry.attributes.color.needsUpdate = true;

			pointCloud.geometry.attributes.position.needsUpdate = true;

			requestAnimationFrame( animate );

			// stats.update();
			render();

		}

		function render() {
			const time = Date.now() * 0.001;

			group.rotation.y = time * 0.1;
			group.rotation.z = time * 0.1;

			renderer.render( scene, camera );
		}


		var w,h,s;
  		this.sizeWindow = function(_w, _h, _s){  			
  			if(_w) {
  				w = _w;
  				h = _h;
  				s = _s;
  			}
  				
  			self._width=w;
			// self._height=h;

			if(!this.panel) return
			this.panel.width = self._width;
  		} 

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

