const { response } = require('express');

const { Usuario } = require('../models');




// const coleccionesPermitidas = [
//     'usuarios',
//     'categorias',
//     'productos',
//     'roles'
// ];

// const buscarUsuarios = async( termino = '', res = response ) => {

//     const esMongoID = ObjectId.isValid( termino ); // TRUE 

//     if ( esMongoID ) {
//         const usuario = await Usuario.findById(termino);
//         return res.json({
//             results: ( usuario ) ? [ usuario ] : []
//         });
//     }

//     const regex = new RegExp( termino, 'i' );
//     const usuarios = await Usuario.find({
//         $or: [{ nombre: regex }, { correo: regex }],
//         $and: [{ estado: true }]
//     });

//     res.json({
//         results: usuarios
//     });

// }

// const buscarCategorias = async( termino = '', res = response ) => {

//     const esMongoID = ObjectId.isValid( termino ); // TRUE 

//     if ( esMongoID ) {
//         const categoria = await Categoria.findById(termino);
//         return res.json({
//             results: ( categoria ) ? [ categoria ] : []
//         });
//     }

//     const regex = new RegExp( termino, 'i' );
//     const categorias = await Categoria.find({ nombre: regex, estado: true });

//     res.json({
//         results: categorias
//     });

// }


// const buscar = ( req, res = response ) => {
    
//     const { coleccion, termino  } = req.params;

//     if ( !coleccionesPermitidas.includes( coleccion ) ) {
//         return res.status(400).json({
//             msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
//         })
//     }

//     switch (coleccion) {
//         case 'usuarios':
//             buscarUsuarios(termino, res);
//         break;
//         case 'categorias':
//             buscarCategorias(termino, res);
//         break;
//         case 'productos':
//             buscarProductos(termino, res);
//         break;

//         default:
//             res.status(500).json({
//                 msg: 'Se le olvido hacer esta búsquda'
//             })
//     }

// }







    const buscarUsuario = async( req, res = response ) => {

        const { termino } = req.params;

        try {
            const regex = new RegExp(termino, 'i');   

            const user = await Usuario.find({ 
                $or: [{ nombre: regex }, { cedula: regex }, { movil: regex }, { correo: regex }],
                $and:[{ estado: true }]
            });


            res.json({
                ok: true,
                user,
            });

        } catch(error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el Administrador'
            });
        }
    }




module.exports = {
    buscarUsuario
}