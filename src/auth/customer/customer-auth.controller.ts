import { Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { LoginDto } from "../dto/auth.dto";

@Controller
export class CustomerAuthController{
    constructor(){}

    @Post('customer/login')
    @HttpCode(HttpStatus.OK)
    async loginCustomer(@Body() loginDto: LoginDto, @Res({passthrough: true}) reply: FastifyReply){

    }
}