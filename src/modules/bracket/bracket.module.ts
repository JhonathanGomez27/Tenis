import { BracketController } from './bracket.controller';
import { BracketService } from './bracket.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        BracketController
    ],
    providers: [
        BracketService
    ],
    exports: [
        BracketService
    ]
})
export class BracketModule { }
