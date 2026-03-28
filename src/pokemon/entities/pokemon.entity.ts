import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema() //decorador para indicar que esta clase es un esquema de Mongoose
export class Pokemon extends Document { //extend Document para que pueda ser tratado como un documento de MongoDB

    @Prop({ unique: true, index: true }) //decorador para indicar que esta propiedad es un campo de Mongoose, con las opciones unique e index para que sea único y tenga un índice en la base de datos
    name: string;

    @Prop({ unique: true, index: true })
    no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon); //crea el esquema a partir de la clase Pokemon
