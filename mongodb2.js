//db.profesores.drop();
//db.cursos.drop();

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
            departamento: "matematicas",
            salario: "450000",
            activo: true
        },
        {
            nombre: "Marcos",
            edad: 70,
            especialidad: "Matematica II",
            aniosExperiencia: 20,
            email: "marcos@gmai.com",
            departamento: "fisica",
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
    
    
    
    
    
//
// EJERCICIO 2: SISTEMA DE CURSOS Y MATRICULACIONES
//

//---------------------------------------------------------------------
//crear coleccion de "cursos", con validacion.
db.createCollection("cursos", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["codigo", "nombre", "creditos", "profesorId", "horario", "cupoMaximo", "inscritos"],
            properties: {
                codigo:{bsonType: "string"},
                nombre: {bsonType: "string"},
                creditos:{bsonType: "int"},
                profesorId:{bsonType: "objectId"},
                horario:{bsonType: "object"},
                cupoMaximo:{bsonType: "int"},
                inscritos:{bsonType: "array"}
            }
        }
    }
})

//---------------------------------------------------------------------
// cargar 2 documentos en la coleccion cursos
var profesorIdMatematica = db.profesores.findOne({especialidad: "Matematica II"})._id
var profesorIdAlgebra = db.profesores.findOne({especialidad: "Algebra II"})._id
var profesoresIdAlgoritmos = db.profesores.findOne({especialidad: "Algoritmos II"})._id

db.cursos.createIndex({codigo: 1}, {unique: true})

db.cursos.insertMany([
    {
        codigo: "MAT101",
        nombre: "Matemactica II",
        creditos: 2,
        profesorId: profesorIdMatematica,
        horario: {"lunes": "7-12", "miercoles": "7-12", "viernes": "7-12"},
        cupoMaximo: 50,
        inscritos: []
    },
    {
        codigo: "ALG101",
        nombre: "Algebra II",
        creditos: 3,
        profesorId: profesorIdAlgebra,
        horario: {"martes": "13-16", "miercoles": "13-16", "viernes": "13-16"},
        cupoMaximo: 20,
        inscritos: []
    },
    {
        codigo: "ALGO101",
        nombre: "Algoritmos II",
        creditos: 2,
        profesorId: profesoresIdAlgoritmos,
        horario: {"lunes": "15-19", "miercoles": "15-19", "viernes": "15-19"},
        cupoMaximo: 120,
        inscritos: []
    }
])

//-------------------------------------------------------------------
//Matricular un alumno en un curso agregando al arreglo "inscritos"

var alumno1 = ObjectId() 
var alumno2 = ObjectId()

db.cursos.updateOne(
    { 
        codigo: "ALG101", 
        $expr: { $lt: [ { $size: "$inscritos" }, "$cupoMaximo" ]}
    },
    {$push: {inscritos: {alumnoId: alumno1, fechaInscripcion: new Date(), estado: "activo"}}},
)

db.cursos.updateOne(
    {
        codigo: "ALG101",
        $expr: { $lt: [ { $size: "$inscritos" }, "$cupoMaximo" ]}
    },
    {$push: {inscritos: {alumnoId: alumno2, fechaInscripcion: new Date(), estado: "activo"}}},    
)
    
//Consultar cursos con cupos disponibles, calcular n cupos restantes y mostrar disponibles

db.cursos.find({ 
    $expr: {
        $lt: [{$size:"$inscritos"}, "$cupoMaximo" ] 
    }
})         
    


    
    