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
      };

}

LoaderCSV.prototype.getData = function()
{
    return 'myData';
}

/*

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "data.txt",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});

function processData(allText) {
    var record_num = 5;  // or however many elements there are in each row
    var allTextLines = allText.split(/\r\n|\n/);
    var entries = allTextLines[0].split(',');
    var lines = [];

    var headings = entries.splice(0,record_num);
    while (entries.length>0) {
        var tarr = [];
        for (var j=0; j<record_num; j++) {
            tarr.push(headings[j]+":"+entries.shift());
        }
        lines.push(tarr);
    }
    // alert(lines);
}
*/