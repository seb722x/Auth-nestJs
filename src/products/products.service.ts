import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


import { validate as isUUID } from 'uuid';
import { Product } from './entities';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,

  ) {}



  async create(createProductDto: CreateProductDto, user: User) {
    
    try {
      const {  ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        user,
      });
      
      await this.productRepository.save( product );

      return { ...product };
      
    } catch (error) {
      this.handleDBExceptions(error);
    }


  }

   findAll(){
    
      return this.productRepository.find({})
  } 
  

  async findOne( term: string ) {

    let product: Product;

    if ( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod'); 
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }


    if ( !product ) 
      throw new NotFoundException(`Product with ${ term } not found`);

    return product;
  }

  async findOnePlain( term: string ) {
    const {  ...rest } = await this.findOne( term );
    return {
      ...rest
    }
  }



  async update( id: string, updateProductDto: UpdateProductDto, user: User ) {

    const { ...toUpdate } = updateProductDto;


    const product = await this.productRepository.preload({ id, ...toUpdate });

    if ( !product ) throw new NotFoundException(`Product with id: ${ id } not found`);

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

           
      // await this.productRepository.save( product );
      product.user = user;
      
      await queryRunner.manager.save( product );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain( id );
      
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }

  }


  async remove(id: string) {
    const product = await this.findOne( id );
    await this.productRepository.remove( product );
    
  }



  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

}
