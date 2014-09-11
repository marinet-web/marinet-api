"use strict";
const
    FS = require('fs'),
    Path = require('path'),
    parent = module.parent,
    parentFile = parent.filename,
    parentDir = Path.dirname(parentFile),
    changeCase = require('change-case');

let dir = 'lib/commands',
    files = FS.readdirSync(dir),
    map = {};

module.exports = function (Models, Q) {

    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let ext = Path.extname(file);
        let base = changeCase.camelCase(Path.basename(file, ext));
        let path = Path.resolve(dir, file);
        map[base] = require(path)(Models, Q);
    };

    return map;
};
