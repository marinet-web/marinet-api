"use strict";
const
    FS = require('fs'),
    Path = require('path'),
    parent = module.parent,
    parentFile = parent.filename,
    parentDir = Path.dirname(parentFile),
    changeCase = require('change-case');

let dir = Path.join(__dirname,'/models'),
    files = FS.readdirSync(dir),
    map = {};

module.exports = function (mongoose) {

    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let ext = Path.extname(file);
        let base = changeCase.upperCaseFirst(Path.basename(file, ext));
        let path = Path.resolve(dir, file);
        map[base] = require(path)(mongoose);
    };

    return map;
};
