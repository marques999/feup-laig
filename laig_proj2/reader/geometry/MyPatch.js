function MyPatch(scene, degree1, degree2, knots1, knots2, controlvertexes) {

	CGFobject.call(this, scene);

	this.degree1 = degree1;
	this.degree2 = degree2;
	this.knots1 = knots1;
	this.knot2 = knots2;
	
	this.vertices = [];
	this.normals = [];
	this.texCoords = [];
	this.initBuffers();
};

MyPatch.prototype.getPoint(t1, t2) {
	var u = this.knots1[0] + t1 * (this.knots1[this.knots1.length - 1] - this.knots1[0]);
	var v = this.knots2[0] + t2 * (this.knots2[this.knots2.length - 1] - this.knots2[0]);
	return this.calculateSurfacePoint(u, v);
}

MyPatch.prototype.calculateSurfacePoint(u, v) {

	var uspan = this.findSpan( p, u, U );
	var vspan = this.findSpan( q, v, V );
	var Nu = this.calcBasisFunctions( uspan, u, p, U );
	var Nv = this.calcBasisFunctions( vspan, v, q, V );
	var temp = [];

	for ( var l = 0; l <= q; ++ l ) {

		temp[ l ] = new THREE.Vector4( 0, 0, 0, 0 );
		for ( var k = 0; k <= p; ++ k ) {

			var point = P[ uspan - p + k ][ vspan - q + l ].clone();
			var w = point.w;
			point.x *= w;
			point.y *= w;
			point.z *= w;
			temp[ l ].add( point.multiplyScalar( Nu[ k ] ) );

		}

	}

	var Sw = new THREE.Vector4( 0, 0, 0, 0 );
	for ( var l = 0; l <= q; ++ l ) {

		Sw.add( temp[ l ].multiplyScalar( Nv[ l ] ) );

	}

	Sw.divideScalar( Sw.w );
	return new THREE.Vector3( Sw.x, Sw.y, Sw.z );
}