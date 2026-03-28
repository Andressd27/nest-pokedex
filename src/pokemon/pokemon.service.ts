import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  constructor(

    @InjectModel(Pokemon.name) // Inyectamos el modelo de Pokemon para poder interactuar con la base de datos
    private readonly pokemonModel: Model<Pokemon>, // Definimos una propiedad privada para el modelo de Pokemon

  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase().trim();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error, 'create');
    }
    
  }

  findAll( PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    return this.pokemonModel.find()
    .limit( limit )
    .skip( offset )
    .sort({ no: 1 })
    .select('-__v'); // Excluimos el campo __v de los resultados utilizando el método select del modelo de Pokemon, pasando '-__v' para indicar que queremos excluir ese campo
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    if ( !isNaN(+term) ) { // Si el term no es un número
      pokemon = await this.pokemonModel.findOne({ no: +term }); 
    }

    // Mongo ID
    if( !pokemon && isValidObjectId(term) ) { // Si el term es un ID de MongoDB válido
      pokemon = await this.pokemonModel.findById(term); // Buscamos el Pokémon por su ID utilizando el método findById del modelo de Pokemon
    }
    // Name
    if( !pokemon ) { // Si no se ha encontrado el Pokémon por número o ID, intentamos buscarlo por nombre
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() }); // Buscamos el Pokémon por su nombre utilizando el método findOne del modelo de Pokemon, convirtiendo el término a minúsculas y eliminando espacios en blanco
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`); // Si no se encuentra el Pokémon, lanzamos una excepción de no encontrado con un mensaje que indica que el Pokémon no se encontró
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase().trim();
    }  

    try {
      await pokemon.updateOne( updatePokemonDto ); // Actualizamos el Pokémon utilizando el método updateOne del documento encontrado, pasando el DTO de actualización y la opción { new: true } para devolver el documento actualizado
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error, 'update');
    }
    
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne(); // Eliminamos el Pokémon utilizando el método deleteOne del documento encontrado
    // return { id };
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id }); // Eliminamos el Pokémon utilizando el método deleteOne del modelo de Pokemon, pasando el ID del Pokémon a eliminar
    if ( deletedCount === 0 ) throw new NotFoundException(`Pokemon with id "${ id }" not found`);
    
    return;
  }

  private handleExceptions( error: any , method: string) {
    if( error.code === 11000 ) {// Si el error es un error de clave duplicada (código 11000 en MongoDB)
      throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify(error.keyValue) }`); // Lanzamos una excepción de mala solicitud con un mensaje que indica que el Pokémon ya existe en la base de datos
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't ${method} Pokemon - Check server logs`); 
  }
}
