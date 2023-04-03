import * as bcrypt from 'bcrypt';

interface SeedProduct {
    description: string;
    stock: number;
    price: number;
    title: string;
  
    
}


interface SeedUser {
    email:    string;
    fullName: string;
    password: string;
    roles:     string[];
}


interface SeedData {
    users: SeedUser[];
    products: SeedProduct[];
}


export const initialData: SeedData = {

    users: [
        {
            email: 'test1@gmail.com',
            fullName: 'Test One',
            password: bcrypt.hashSync( 'Abc123', 10 ),
            roles: ['admin', 'seller']  // falta establecer los roles para enviarlos en el registro
        },
        {
            email: 'test2@gmail.com',
            fullName: 'Test Two',
            password: bcrypt.hashSync( 'Abc123', 10 ),
            roles: ['admin'] // falta establecer los roles para enviarlos en el registro
        }
    ],

    products: [
        
        {
            description: "portatil hp de muy buena calidad señores",
            stock: 4,
            price: 3000,          
            title: "hola mundo",
           
        },
        {
            description: "portatil dell ultimo módelo",
           
            stock: 10,
            price: 2000, 
            title: "hola mund02",
            
        },
        {
            description: "portatil Mac de excelente calidad señores",
            stock: 100,
            price: 6500,            
            title: "MacBook Pro",
          
        },
        {
            description: "portatil Acer 2024",
            stock: 10,
            price: 30,
            title: "Acer 2022",
           
        },
    ]
}