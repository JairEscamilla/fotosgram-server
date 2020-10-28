import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const server = new Server();

// Body parser
server.app.use(bodyParser.urlencoded({
    extended: true
}));

server.app.use(bodyParser.json());

// Levantar express

server.app.use('/user', userRoutes); // Rutas de la aplicación

// Conectar base de datos
mongoose.connect('mongodb://localhost:27017/fotosgram', {
        useNewUrlParser: true,
        useCreateIndex: true
    }, (error) => {
        if(error) throw error;
        console.log('Base de datos online');
        
    })

server.start( () => {
    console.log("Servidor corriendo en puerto " + server.port);
});
