const { promises: fs } = require('fs')

class ContenedorArchivo {

    constructor(ruta) {
        this.ruta = ruta;
    }

    async listar(id) {
        try {
            const productos = await this.listarAll();
            const productoId = productos.find(x => x.id == id);
            return productoId;
        } catch (error) {
            console.error(error);
        }
    }

    async listarAll() {
        try {
            const productos = await fs.readFile(this.ruta);
            const array = JSON.parse(productos)
            return array
        } catch (error) {
            console.error(error);
        }
    }

    async guardar(obj) {

        let id = 0;
        let array = [];
        let objeto;

        try {
            
            const productos = await this.listarAll();
            
            if(productos) {

                id = 1 + parseInt(productos.length);
                const newObjeto = {...obj, id: id};
                array.push(...productos, newObjeto);
                objeto = JSON.stringify(array, null, 2);  

                await fs.writeFile(this.ruta, objeto, (error)=>{
                    if(error) {
                        throw new Error('error de escritura')
                    }
                    console.log('escritura exitosa')
                })
                
            } else { 
                id = 1;
                const newObjeto = {...obj, id: id};
                array.push(newObjeto); 
                objeto = JSON.stringify(array, null, 2)

                await fs.writeFile(this.ruta, objeto, (error)=>{
                    if(error) {
                        throw new Error('error de escritura')
                    }
                    console.log('escritura exitosa')
                })

            }

        } catch (error) {
            console.error(error);
        }
    }

    async actualizar(elem, id) {
        try {
            let array = [];
            let objeto;

            const obj = await this.listar(id);
            const newObj = Object.assign(obj, elem);
            await this.borrar(id)
            if(await this.borrar(id)){
                const all = await this.listarAll();
                array.push(...all, newObj);
                objeto = JSON.stringify(array, null, 2);
                console.log(array)
            }
        
            await fs.writeFile(this.ruta, objeto, (error)=> {
                if(error) {
                    throw new Error('escritura fallida');
                }
                console.log("actualizacion completada")
            })
            
        } catch (error) {
            console.error(error);
        }
    }

    async borrar(id) {
        try {
            const productos = await this.listarAll();
            const deleteId = productos.filter(x => x.id != id);
            const arrayFiltrado = JSON.stringify(deleteId, null, 2);
            await this.borrarAll();
            await fs.writeFile(this.ruta, arrayFiltrado, (error)=>{
                if(error) {
                    throw new Error('error de borrado')
                }
                console.log('borrado exitoso')
            })
            return "borrado";
        } catch (error) {
            console.error(error)
        }
    }

    async borrarAll() {
        try {
            await fs.unlink(this.ruta);
            await fs.writeFile(this.ruta, [], (error)=>{
                if(error) {
                    throw new Error('error de borrado')
                }
                console.log('borrado exitoso')
            })
        } catch (error) {
            console.error(error)
        }
    }

    async borrarProducto(id, id_prod) {
        try {
            const carrito = await this.listar(id);
            const producto = carrito.productos.filter(x => x.id != id_prod);
            const newCart = {id: id, productos: producto};
    
            await this.borrar(id);
            await this.guardar(newCart)
        } catch (error) {
            console.error(error);
        }
    }
}


module.exports = ContenedorArchivo