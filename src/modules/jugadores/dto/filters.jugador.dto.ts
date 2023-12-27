import { IsOptional, IsString } from "class-validator";

export class FiltersJugadorDto {

  

    @IsString()
    @IsOptional()
    readonly nombre?: string    


    
    @IsString()
    @IsOptional()
    readonly rama?: string    


    @IsString()
    @IsOptional()
    readonly categoria?: string  
    

 


}