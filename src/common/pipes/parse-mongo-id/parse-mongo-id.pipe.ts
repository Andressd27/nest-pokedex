import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // console.log({ value, metadata });

    if( !isValidObjectId(value) ) throw new BadRequestException(`${ value } is not a valid MongoID`); // Si el valor no es un ID de MongoDB válido, lanzamos una excepción de mala solicitud con un mensaje que indica que el valor no es un ID de MongoDB válido
    
    return value;
  }
}
