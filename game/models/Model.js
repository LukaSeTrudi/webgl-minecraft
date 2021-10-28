import { Node } from '../core/node.js';

export class Model extends Node {

    constructor(mesh, image, options) {
        super(options);
        this.mesh = mesh;
        this.image = image;
    }

}
