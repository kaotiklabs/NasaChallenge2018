//Informacion: conjunto de Capas
function Capas()
{
    this.listaCapas = [];


    //Cargar fichero
    this.cargarCapa = function (idCapa, nombreCapa, csvFichero )
    {
        var fechaPointer, altitudPointer, longitudPointer, valorPointer, alturaPointer;
        var capa = new Capa(idCapa, nombreCapa);

        for (var i = 0; i < csvFichero.length; i++) 
        { 
            //console.log([i]);
            
            var data = csvFichero[i].split(/,/);
            if(i==0)
            {
                fechaPointer = 5;
                latitudPointer = 2;
                longitudPointer = 3;
                valorPointer = 9;
                alturaPointer = 4;
            }
            else
            {
                if(data.length>=alturaPointer)
                {
                    capa.addDato(data[fechaPointer].substring(0,10), data[latitudPointer], data[longitudPointer], data[valorPointer], data[alturaPointer]);
                }
            }
        }

        this.listaCapas[capa.idCapa] = capa;
    };

    this.getCapa = function(idCapa)
    {
        if(idCapa in this.listaCapas)
        {
            return this.listaCapas[idCapa];
        }
        else
        {
            return null;
        }
    };
}

//Capa: conjunto de Fechas de la misma capa
function Capa(idCapa, nombreCapa)
{
    this.idCapa = idCapa;
    this.nombreCapa = nombreCapa;
    this.fechas = [];

    this.addFecha = function (fechaGrupo)
    {
        this.fechas[fechaGrupo.fecha] = fechaGrupo;
    };

    this.addDato = function (fecha, altitud, longitud, valor, altura)
    {
        var fechaGrupo;
        //existe fecha?
        if(fecha in this.fechas)
        {
            fechaGrupo = this.fechas[fecha];
        }
        else
        {
            fechaGrupo = new FechaGrupo(fecha);
        }

        fechaGrupo.addDato(new Dato(altitud, longitud, valor, altura));

        this.fechas[fecha] = fechaGrupo;
    }

    this.getFecha = function(fecha)
    {
        if(fecha == null)
        {
            return this.fechas["1995-01-01"];
        }
        else if(fecha in this.fechas)
        {
            return this.fechas[fecha];
        }
        else
        {
            return null;
        }
    }

    this.getRango = function(fechaInicial, fechaFinal)
    {
        var datos = [];
        var rango = [];
        for(var x in this.fechas)
        {
            if(x >= fechaInicial && x <= fechaFinal)
            {
                rango.push(x);
            }
        }
        rango.sort();

        for(var ran in rango)
        {
            //console.log(rango[ran]);
            datos.push(this.fechas[rango[ran]]);
        }

        return datos;
    }
}

//FechaGrupo: conjunto de Datos en la misma Fecha
function FechaGrupo(fecha)
{
    this.fecha = fecha; 
    this.datos = [];
    
    this.addDato = function (dato)
    {
        this.datos.push(dato);
    };

    this.getDatos = function()
    {
        return this.datos;
    }
}

//Dato: detalle modular
function Dato(latitud, longitud, valor, altura)
{
    this.latitud = latitud;
    this.longitud = longitud;
    this.valor = valor;
    this.altura = altura;
}