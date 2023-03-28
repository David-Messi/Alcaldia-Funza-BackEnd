
const { Schema, model } = require('mongoose');





const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    
    movil: {
        type: String,
        required: true,
    },

    correo: {
        type: String,
        // required: [true, 'El correo es obligatorio'],
        unique: true
    },

    password: {
        type: String,
    },

    img: {
        type: String,
    },

    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['SUPER_ROLE', 'ADMIN_ROLE', 'USER_ROLE']
    },

    estado: {
        type: Boolean,
        default: true
    },

    cedula: {
        type: String,
    },

    direccion: {
        type: String,
    },

    ciudad: {
        type: String,
    },

});



UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario  } = this.toObject();
    usuario.uid = _id;
    return usuario;
}




module.exports = model( 'Usuario', UsuarioSchema );
