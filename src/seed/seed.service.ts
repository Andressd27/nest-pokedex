import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  

  constructor(
    @InjectModel(Pokemon.name) // Inyectamos el modelo de Pokemon para poder interactuar con la base de datos
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter, // Inyectamos el adaptador HTTP para hacer las peticiones a la API externa
  ) {}

  async executeSeed() {

    await this.pokemonModel.deleteMany({}); // Limpiamos la colección de Pokemon antes de insertar los nuevos datos

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    // PRIMERA FORMA DE HACERLO, PERO NO ES LA MEJOR
    // const insertPromisesArray: Promise<Pokemon>[] = [];

    // data.results.forEach(async ( { name, url } ) => {
    //   const segments = url.split('/');
    //   const no:number = +segments[segments.length - 2];
       
    //   // const pokemon = await this.pokemonModel.create({ name, no });
    //   insertPromisesArray.push(
    //     this.pokemonModel.create({ name, no })
    //   );
    // })
    // await Promise.all(insertPromisesArray);

    // SEGUNDA FORMA DE HACERLO, ES LA MEJOR
    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      pokemonToInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany(pokemonToInsert); // insertMany es más eficiente que crear cada documento por separado
    
    return 'Seed executed';
  }
}
