//
// EJERCICIO 1: CREAR UN SISTEMA DE GESTION ACADEMICA
//

//---------------------------------------------------------------------
//crear coleccion de "profesores", con validacion.
db.createCollection("profesores",
{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["nombre", "edad", "especialidad", "aniosExperiencia"],
            properties: {
                nombre: {bsonType: "string"},
                edad: {bsonType: "int", minimum:25, maximum: 70},
                especialidad: {bsonType: "string"},
                aniosExperiencia: {bsonType: "int", minimum: 0}
            } 

        }
    }
}
)

//---------------------------------------------------------------------
// cargar tres documentos en la colecion profesores

db.profesores.insertMany([
    {
        nombre: "Victor",
        edad: 37,
        especialidad: "Algoritmos II",
        aniosExperiencia: 10,
        email: "victor@gmai.com",
        departamento: "computacion",
        salario: "400000",
        activo: false
    },
    {
        nombre: "Selena",
        edad: 56,
        especialidad: "Algebra II",
        aniosExperiencia: 18,
        email: "Selena@gmai.com",
        departamento: "Matematicas",
        salario: "450000",
        activo: true
    },
    {
        nombre: "Marcos",
        edad: 70,
        especialidad: "Metalurgia II",
        aniosExperiencia: 20,
        email: "marcos@gmai.com",
        departamento: "FISICA",
        salario: "500000",
        activo: true
    }
])

//-------------------------------------------------------------------
//Busqueda de todos los profesores con mas de 15 años de experiencia

db.profesores.find({aniosExperiencia: {$gt:15} },{_id:0})


//Calcular promedio de edad, experiencia y salario de los profesores activos
db.profesores.aggregate([
    {
        $group: {
            _id: null,
            promedioEdad: { $avg: "$edad" },
            promedioAniosExperiencia: {$avg: "$aniosExperiencia"},
            promedioSalarioActivos: {
                $avg: {
                    $cond: [
                        {$eq: ["$activo", true]}, {$toDouble: "$salario"}, null
                    ]
                }
            }
        }
    }
])

//Generar estadisticas por departamento: cantidad de profesores, expericia
//total, salario promedio y listado de nombres

db.profesores.aggregate([
    {
        $group: {
            _id: "$departamento",
            numeroProfesores: {$sum: 1},
            promedioAniosExperiencia: {$sum: "$aniosExperiencia"},
            promedioSalario: {$avg: {$toDouble: "$salario"}},
            listaNombres: {$push: "$nombre"}       
        }
    }
])




