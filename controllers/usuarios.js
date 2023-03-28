const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid');

const Usuario = require('../models/usuario');



const usuariosGet = async(req = request, res = response) => {

    // const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            // .skip( Number( desde ) )
            // .limit(Number( limite ))
    ]);

    res.json({
        ok: true,
        usuarios,
        total,
    });
}



const usuariosGetDesactivados = async(req = request, res = response) => {

    // const { limite = 5, desde = 0 } = req.query;
    const query = { estado: false };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            // .skip( Number( desde ) )
            // .limit(Number( limite ))
    ]);

    res.json({
        ok: true,
        usuarios,
        total,
    });
}




const usuariosPost = async(req, res = response) => {
    
    const { nombre, correo } = req.body;
    const password = '1234567';

    const usuario = new Usuario({ ...req.body });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    res.json({
        ok: true,
        usuario
    });
}



const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, { new: true });

    res.json({
        ok: true,
        usuario,
    });
}





const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;
    const estadoDB = await Usuario.findById( id );
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: !estadoDB.estado } );

    
    res.json({
        ok: true,
        usuario,
    });
}



const crearUserDesdeArchivoExel = async(req, res) => {

    // let usuariosDB = [];


    try {
        // Validar que Exista un Archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No hay Archivo'
            });
        }

        //Procesar Una Imagen
        const file = req.files.exel;
        console.log(file.data);


        const nombreCortado = file.name.split('.');
        const extencionArchivo = nombreCortado[ nombreCortado.length - 1 ];

        // validar Extencion
        const extencionValida = ['xlsx']; 

        if( !extencionValida.includes(extencionArchivo) ) {
            return res.status(400).json({
                ok: false,
                msg: 'Extencion No Permitida o Archivo Muy Pesado, Contácte su Diseñador'
            });
        }

        // Generar Nombre Del Archivo
        const nombreArchivo = `${ uuidv4() }.${ extencionArchivo }`;

        // Path para Guardar Imagen
        const path = `uploads/${ nombreArchivo }`;

        const moveFile = (a, b) => {
            return new Promise((resolve, reject) => {
                file.mv(path, (err) => {
                    if (err) {
                        console.log(err);
                        reject({
                            ok: false,
                            msg: 'Error al Mover el Archivo'
                        });
                    } else {
                        resolve({
                            ok: true,
                            msg: 'Archivo movido correctamente'
                        });
                    }
                });
            });
        }

        const archivoMovido = await moveFile(file, path);

        if( archivoMovido.ok ){
            const excel = xlsx.readFile(path);
            const nombreHoja = excel.SheetNames;
            let datos = xlsx.utils.sheet_to_json(excel.Sheets[nombreHoja[0]]);
            
            // Itera a través de los datos y guárdalos en la base de datos
            for (const data of datos) {
                const verificarEmail = await Usuario.findOne({ correo: data.correo });
                if(!data.nombre || verificarEmail){
                    const user = new Usuario({
                        ...data,
                        estado: false
                    });
                    user.save({ validateBeforeSave: false });
                }else {
                    const newData = new Usuario({
                        nombre: data.nombre,
                        correo: data.correo,
                        movil: data.movil,
                        cedula: data.cedula,
                        direccion: data.direccion,
                        ciudad: data.ciudad,
                    });
                    await newData.save();
                }
            };

        }


        res.json({
            ok: true,
            msg: 'Arcivo Subido Con Exito'
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        });
    }

}




module.exports = {
    usuariosGet,
    usuariosGetDesactivados,
    usuariosPost,
    crearUserDesdeArchivoExel,
    usuariosPut,
    usuariosDelete,
}