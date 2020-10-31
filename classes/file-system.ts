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
}