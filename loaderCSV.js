/*
function LoaderCSV(filename)
{
    this.filename = filename;
    
    //Leer fichero
    this.openFile = function() {
        console.log("caca");
        var reader = new FileReader();
        reader.onload = function(){
          var text = reader.result;
          console.log(reader.result.substring(0, 200));
        };
        reader.readAsText(filename);
        console.log(reader.result.substring(0,200));
      };

}
*/