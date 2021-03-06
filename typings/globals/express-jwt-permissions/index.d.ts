// Generated by typings
declare module "express-jwt-permissions" {
    
    import express = require('express');

    namespace guard {
        export interface Guard {
            (options?: Options): Guard;
            check(required: [string]): express.RequestHandler;
        }

        export interface Options{
            requestProperty: string;
            permissionsProperty: string;
        }
    }

    function guard(options?: guard.Options): guard.Guard;

    export = guard;
}