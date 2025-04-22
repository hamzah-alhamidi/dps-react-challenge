import dpsLogo from './assets/DPS.svg';
import './App.css';

function App() {
	return (
		<>
			<div>
				<a href="https://www.digitalproductschool.io/" target="_blank">
					<img src={dpsLogo} className="logo" alt="DPS logo" />
				</a>
			</div>
			<div className="home-card">
				<div className="control-panel">
					{/* Control panel content will go here */}
				</div>
				<div className="data-table">
					{/* Data table content will go here */}
				</div>
			</div>
		</>
	);
}

export default App;
