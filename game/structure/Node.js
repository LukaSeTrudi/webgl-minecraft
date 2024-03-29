import { vec3, mat4, quat } from '../../lib/gl-matrix-module.js';

import { Utils } from '../Utils.js';

export class Node {

    constructor(options) {
        Utils.init(this, Node.defaults, options);
        this.transform = mat4.create();
        this.updateTransform();

        this.chunkVisible = true;
        this.children = [];
        this.parent = null;
    }

    updateTransform(_origin=[0.5, 0.5, 0.5]) {
        const t = this.transform;
        const degrees = this.rotation.map(x => x * 180 / Math.PI);
        const q = quat.fromEuler(quat.create(), ...degrees);
        const v = vec3.clone(this.translation);
        const s = vec3.clone(this.scale);
        const origin = vec3.clone(_origin)
        mat4.fromRotationTranslationScaleOrigin(t, q, v, s, origin);
    }

    getGlobalTransform() {
        if (!this.parent) {
            return mat4.clone(this.transform);
        } else {
            let transform = this.parent.getGlobalTransform();
            return mat4.mul(transform, transform, this.transform);
        }
    }

    addChild(node) {
        this.children.push(node);
        node.isPlayer = this.isPlayer;
        node.parent = this;
    }

    removeChild(node) {
        const index = this.children.indexOf(node);
        if (index >= 0) {
            this.children.splice(index, 1);
            node.parent = null;
        }
    }

    traverse(before, after) {
        if (before) {
            before(this);
        }
        for (let child of this.children) {
            child.traverse(before, after);
        }
        if (after) {
            after(this);
        }
    }
}

Node.defaults = {
    translation: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    aabb: {
        min: [-0.5, -0.5, -0.5],
        max: [0.5, 0.5, 0.5],
    },
    extra: null,
    collidable: false,
    visible: true,
    doubleSide: false,
    transparent: false,
    light: Array(6).fill(1),
    lightSource: false,
    sunLight: 0
};
