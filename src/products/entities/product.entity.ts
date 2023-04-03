import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    title: string;

    @Column('float',{
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;


    @Column('int', {
        default: 0
    })
    stock: number;



   
   


    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User




}
