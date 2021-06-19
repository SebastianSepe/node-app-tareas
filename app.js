require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, 
        pausa,
        leerInput,
        listadoTareaBorrar,
        confirmar,
        mostratListadoCheckList
} = require('./helpers/inquirer');

const Tareas = require('./models/tareas');


const main = async() =>{

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if (tareasDB){ //cargar tareas
        tareas.cargarTareasFromArray(tareasDB);
    }

    do{
        opt = await inquirerMenu();
        
        switch (opt) {
            case '1': // Crear opcion
                const desc = await leerInput('Descripcion:');
                tareas.crearTarea ( desc );
            break;
             
            case '2': // Listado
                tareas.listadoCompleto();
            break;
                
            case '3': // Listar completadas
                tareas.listarPendientesCompletadas(true);
            break;
                
            case '4': // Listar pendientes
                tareas.listarPendientesCompletadas(false);
            break;

            case '5': // Completado || Pendiente
                const ids = await mostratListadoCheckList (tareas.listadoArr);
                tareas.toggleCompletadas( ids );
            break;
            
            case '6': // Borrar
                const id = await listadoTareaBorrar(tareas.listadoArr);
                if (id !=='0'){
                    const ok = await confirmar('Esta seguro?');
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada');
                    }
                }
            break; 
        }



         guardarDB( tareas.listadoArr );


        await pausa();

        
    }while( opt !== '0' );

    // pausa();

}

main();

