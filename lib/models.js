"use strict";
const
    FS = require('fs'),
    Path = require('path'),
    parent = module.parent,
    parentFile = parent.filename,
    parentDir = Path.dirname(parentFile);

let dir = 'lib/models',
    files = FS.readdirSync(dir),
    map = {};

module.exports = function (mongoose) {
    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let ext = Path.extname(file);
        let base = Path.basename(file, ext).capitalize();
        let path = Path.resolve(dir, file);
        map[base] = require(path)(mongoose);
    };

    return map;
};
