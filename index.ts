import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/post';
import fileUpload from 'express-fileupload';

const server = new Server();

// Body parser
server.app.use(bodyParser.urlencoded({
    extended: true
}));

server.app.use(bodyParser.json());


// FileUpload
server.app.use(fileUpload());


// Levantar express

server.app.use('/posts', postRoutes); // Rutas de la aplicación
server.app.use('/user', userRoutes); // Rutas de la aplicación

// Conectar base de datos
mongoose.connect('mongodb://localhost:27017/fotosgram', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }, (error) => {
        if(error) throw error;
        console.log('Base de datos online');
        
    })

server.start( () => {
    console.log("Servidor corriendo en puerto " + server.port);
});
