const terminal = require('./terminal.js');

module.exports = {

	list : function(data) {
		if(data.length == 0) {
			terminal.echo("Empty data");
			return;
		}

		var html = "";
		html = "<ul>";

		for (var i = 0; i < data.length; i++) {
			var row = data[i];
			html += "<li>" + row + "</li>";
		}

		html += "</ul>";

		terminal.echo(html, {raw: true});
	},

	table : function(cols, rows) {
		//cols = ['col1', 'col2']
		//rows = [
			// ['row1.1', 'row1.2']
			// ['row2.1', 'row2.2']
		//]

		var html = "<table>";
		html += "<thead>";

		for (var i = 0; i < cols.length; i++) {
			var col = cols[i];
			html += '<th>'+col+'</th>';
		}

		html += "</thead>";

		for (var i = 0; i < rows.length; i++) {
			var row = rows[i];
			html += "<tr>";
			for (var j = 0; j < row.length; j++) {
				var cell = row[j];
				html += "<td>" + cell + "</td>";
			}
			html += "</tr>";
		}

		

		html += "</table>";

		terminal.echo(html, {raw: true});
	}

}