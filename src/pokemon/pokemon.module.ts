import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([ //importamos el esquema de Mongoose para que pueda ser utilizado en el módulo
      { 
        name: Pokemon.name, //nombre del modelo, que debe ser el mismo que el nombre de la clase del esquema
        schema: PokemonSchema //esquema que se va a utilizar para el modelo, que es el esquema creado a partir de la clase Pokemon
      }
    ])
  ],
  exports: [
    MongooseModule
  ]
})
export class PokemonModule {}
