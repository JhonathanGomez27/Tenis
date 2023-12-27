import { IsInt, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class FiltersParejaDto  {

    @IsNumber()
    @IsPositive()
    @IsInt()
    @IsOptional()
    readonly ranking?: number

    @IsString()
    @IsOptional()
    readonly rama?: string    


    @IsString()
    @IsOptional()
    readonly categoria?: string  
    
}
