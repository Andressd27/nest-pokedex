import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    @IsInt() //decorador para indicar que esta propiedad debe ser un número entero
    @IsPositive() //decorador para indicar que esta propiedad debe ser un número positivo
    @Min(1) //decorador para indicar que esta propiedad debe tener un valor mínimo de 1
    no: number;

    @IsString()
    @MinLength(1)
    name: string;
}
