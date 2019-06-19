import React from 'react';
import { Helmet } from "react-helmet";
import NumericInput from 'react-numeric-input';
import { SketchPicker } from 'react-color';
import './sass/tables.scss';
  
class App extends React.Component {
	constructor(props, context) {
		super(props, context);
		const r = 4,
			c = 4;
		var data = []
		for (let i=0; i<r;i++) {
			var row = []
			for (let j=0; j<c;j++) {
				row.push("")
			}
			data.push(row)
		}
		this.state = {
			data: data,
			output: "",
			options: {
				width: 800,
				fontsize: 14,
				color: "#0091ff"
			},
			displayColorPicker: false,
		}
		
		this.setRows = this.setRows.bind(this);
		this.export = this.export.bind(this);
		this.addColumn = this.addColumn.bind(this);
		this.removeColumn = this.removeColumn.bind(this);
		this.addRow = this.addRow.bind(this);
		this.removeRow = this.removeRow.bind(this);
		this.copyToClipboard = this.copyToClipboard.bind(this);
		this.onPaste = this.onPaste.bind(this);
		this.updateOptions = this.updateOptions.bind(this);
		
	}

	componentDidMount() {
		this.export()
	}

	cellChanged(e, row, col) {
		var data = this.state.data
		data[row][col] = e.target.textContent;
		this.setState({data: data})
		this.export();

	}

	export() {
		var table = document.createElement("table"),
			thead = document.createElement("thead"),
			tbody = document.createElement("tbody");

		table.style.cssText = `border-collapse: separate; border-spacing: 0; width: 100%; max-width: ${this.state.options.width}px; text-align: left; color: #666; margin: 0 auto; font-size: ${this.state.options.fontsize}px;`
		tbody.style.cssText = "background-color: #fff;"
		table.width = "100%"

		for(let i = 0; i < this.state.data.length; i++) {
			var row = document.createElement("tr"),
				section = i===0 ? thead : tbody,
				cssText = i===0 ? `background-color: ${this.state.options.color}; border-bottom: 0; padding: 12px 16px; color: #fff;` : `padding: 12px 16px;`;
			if(i % 2) {
				row.style.cssText = "background-color: #f4f3f3;"
			}
			for(let j = 0; j < this.state.data[i].length; j++) {
				var cell = i===0 ? document.createElement("th") : document.createElement("td")
				cell.innerHTML = this.state.data[i][j];
				cell.style.cssText = cssText
				row.appendChild(cell)
			}

			section.appendChild(row)

		}
		table.appendChild(thead)
		table.appendChild(tbody)

		this.setState({output: table.outerHTML})
	}
	

	setRows(row, ridx) {
		ridx=ridx+1
		return <tr key={ridx}>{row.map((c, cidx) => <td key={ridx+'_'+cidx} onPaste={ this.onPaste } onBlur={(e) => this.cellChanged(e, ridx, cidx)} contentEditable="true">{c}</td>)}</tr>
	}

	addColumn() {
		var data = this.state.data;
		for(let i = 0; i < data.length; i++) {
			var row = data[i]
			row.push("")
			data[i] = row
		}
		this.setState({data: data})
		this.export();
	}
	removeColumn() {
		var data = this.state.data;
		for(let i = 0; i < data.length; i++) {
			var row = data[i];
			if(row.length>1) {
				row.pop();
				data[i] = row
			}
		}
		this.setState({data: data})
		this.export();
	}

	addRow() {
		var row = [],
			data = this.state.data
		for(let i = 0; i < this.state.data[0].length; i++) {
			row.push("")
		}
		data.push(row)
		this.setState({data: data})
		this.export();
	}
	removeRow() {
		var data = this.state.data;
		if (data.length > 1) {
			data.pop();
			this.setState({
				data: data
			})
		}
		this.export();
	}

	copyToClipboard(e) {
		this.htmlOutput.select();
		document.execCommand('copy');
	}

	textToTable(txt) {
		var data = [],
			raw = txt.split('\n')
		for (let i = 0; i < raw.length; i++) {
			data.push(raw[i].split('\t'))
		}
		this.setState({
			data: data
		});
	}


	onPaste(e) {
		e.preventDefault();
		var text = e.clipboardData.getData("text");
		if(text.indexOf('\t') >= 0){
			var r = window.confirm("Would you like to replace the entire table with this data?");
			if (r === true) {
				this.textToTable(text)
			} else {
				document.execCommand('insertText', false, text);
			}

		}
		else {
			document.execCommand('insertText', false, text);
			return true
		}
	}

	updateOptions() {
		var options = this.state.options
		for(let option in this.state.options) {
			let el = document.querySelector('.table-option[data-option="'+option+'"]');
			if(el!==null && el.tagName.toLowerCase()==='input') {
				options[option] = el.value
			}
		}
		this.setState({options: options})
		this.export();
	}

	colorpickerClick = () => {
		this.setState({ displayColorPicker: !this.state.displayColorPicker })
	};

	colorpickerClose = () => {
		this.setState({ displayColorPicker: false })
	};

	colorpickerChange = (color) => {
		var options = this.state.options
		options.color = color.hex
		this.setState({ options: options})
		this.export();
	};


	render() {
		return (
			<div className="App">
				<Helmet>
					<meta name="robots" content="noindex,follow" />
					<title>tabl.dev</title>
					<meta name="description" content="Create styled tables" />
				</Helmet>
				
				<div id="table-maker">
					<div className="container">
						<h1>tabl<span>.dev</span></h1>
						<div className="table-wrapper row">
							<div className="col">
								<table width="100%" style={{textAlign: 'left', fontSize: this.state.options.fontsize+"px"}} className="table">
									<thead>
										<tr key={0}>
											{this.state.data[0].map((c, cidx) => <th key={'0_'+cidx} style={{ backgroundColor: this.state.options.color }} onPaste={ this.onPaste } onBlur={(e) => this.cellChanged(e, 0, cidx)} contentEditable="true">{c}</th>)}
										</tr>
									</thead>
									<tbody>
										{this.state.data.slice(1).map(this.setRows)}
									</tbody>
								</table>
								<div className="table-actions horizontal">
									<div className="table-action" onClick={this.addRow}><i className="fa fa-plus"></i><span className="tooltiptext">Add Row</span></div>
									<div className="table-action"  onClick={this.removeRow}><i className="fa fa-minus"></i><span className="tooltiptext">Remove Row</span></div>
								</div>
							</div>
							<div className="col">
								<div className="table-actions vertical">
									<div className="table-action" onClick={this.addColumn}><i className="fa fa-plus"></i><span className="tooltiptext">Add Column</span></div>
									<div className="table-action"  onClick={this.removeColumn}><i className="fa fa-minus"></i><span className="tooltiptext">Remove Column</span></div>
								</div>
							</div>
						</div>
						<div className="output-wrapper">
							<input id="output" defaultValue={this.state.output} ref={(htmlOutput) => this.htmlOutput = htmlOutput} />
							<div className="btn-copy" onClick={this.copyToClipboard}>Copy Code</div>
						</div>
						<div className="toolbar-wrapper">
							<h3>Export Options</h3>
							<div className="toolbar">
							
								<div className="row">
									<div className="col">
										<div className="row">
											<div className="col">
												<label>width:</label>
											</div>
											<div className="col">
												<NumericInput id="table_width" className="table-option" data-option="width" value={this.state.options.width} step={1} min={1} max={9999} onChange={this.updateOptions}/>
											</div>
										</div>
									</div>
									<div className="col">
										<div className="row">
											<div className="col">
												<label>font size:</label>
											</div>
											<div className="col">
												<NumericInput id="table_fontsize" className="table-option" data-option="fontsize" value={this.state.options.fontsize} step={1} min={4} max={32} onChange={this.updateOptions}/>
											</div>
										</div>
									</div>
									<div className="col">
										<div className="row">
											<div className="col">
												<label>header color:</label>
											</div>
											<div className="col">
												<div className="colorpicker">
													<div className="swatch" onClick={ this.colorpickerClick }>
														<div className="color" style={{background: this.state.options.color}} />
													</div>
													{ this.state.displayColorPicker ? <div className="popover">
													<div className="cover" onClick={ this.colorpickerClose }/>
													<SketchPicker color={ this.state.options.color } onChange={ this.colorpickerChange } />
													</div> : null }
												</div>
												
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="footer row">
							<div className="col">
								<div className="copyright">
									© { new Date().getFullYear() } tabl.dev
								</div>
							</div>
							<div className="col">
								<div className="social-media">
									<a href="https://github.com/Szar/tabl" target="_blank" rel="noopener noreferrer"><i className="fa fa-github-alt" aria-hidden="true"></i></a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default App;
