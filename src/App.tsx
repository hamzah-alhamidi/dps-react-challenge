import dpsLogo from './assets/DPS.svg';
import './App.css';

function App() {
	const sampleData = [
		{ name: 'Alotta Fudge', city: 'New York', birthday: '1.3.1995' },
		{ name: 'John Doe', city: 'London', birthday: '15.6.1990' },
		{ name: 'Jane Smith', city: 'Paris', birthday: '22.8.1988' },
	];
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
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>City</th>
								<th>Birthday</th>
							</tr>
						</thead>
						<tbody>
							{sampleData.map((person, index) => (
								<tr key={index}>
									<td>{person.name}</td>
									<td>{person.city}</td>
									<td>{person.birthday}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}

export default App;
