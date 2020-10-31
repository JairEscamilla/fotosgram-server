import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';


export default class FileSystem{
    constructor(){

    }

    guardarImagenTemporal(file: FileUpload, userId: string){

        return new Promise((resolve, reject) => {
            // Crear carpetas
            const path = this.crearCarpetaUsuario(userId);

            // Nombre del archivo
            const nombreArchivo = this.generarNombre(file.name);

            // Mover el archivo del temp a nuestra carpeta
            file.mv(path + '/' + nombreArchivo, (err: any) => {
                if (err) {
                    reject(err);
                    // No se pudo mover
                } else {
                    resolve();
                    // Todo salio bien
                }
            });
        });
        

    }

    imagenesDeTempHaciaPost(userId: string){
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path.resolve(__dirname, '../uploads/', userId, 'posts');

        if(!fs.existsSync(pathTemp)){
            return [];
        }

        if(!fs.existsSync(pathPost)){
            fs.mkdirSync(pathPost);
        }

        const imagenesTemp = this.obtenerImagenesEnTemp(userId);

        imagenesTemp.forEach(imagen => {
            fs.renameSync(pathTemp + "/" + imagen, pathPost + "/" + imagen);
        })

        return imagenesTemp;

    }

    private obtenerImagenesEnTemp(userId: string){  
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs.readdirSync(pathTemp) || [];
    }   

    private generarNombre(nombreOriginal: string){
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];

        const idUnico = uniqid();
        const retorno =  idUnico + "."+ extension;
        return retorno;
    }

    private crearCarpetaUsuario(userId: string){
        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';

        const existe = fs.existsSync(pathUser);

        if(!existe){
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp;
        
    }

    getFotoUrl(userId: string, img: string ){
        const pathFoto = path.resolve(__dirname, "../uploads", userId, 'posts', img)
        const existe = fs.existsSync(pathFoto);
        
        return pathFoto;
    }
}