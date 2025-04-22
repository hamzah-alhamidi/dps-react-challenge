import { useState, useEffect } from 'react';
import dpsLogo from './assets/DPS.svg';
import './App.css';

interface User {
	name: string;
	city: string;
	birthday: string;
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${day}.${month}.${year}`;
}

function App() {
	const [userData, setUserData] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch('https://dummyjson.com/users');
				const data = await response.json();

				const transformedData = data.users.map((user: any) => ({
					name: `${user.firstName} ${user.lastName}`,
					city: user.address.city,
					birthday: formatDate(user.birthDate),
				}));

				setUserData(transformedData);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching users:', error);
				setIsLoading(false);
			}
		};

		fetchUsers();
	}, []);

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
					{isLoading ? (
						<p>Loading data...</p>
					) : (
						<table>
							<thead>
								<tr>
									<th>Name</th>
									<th>City</th>
									<th>Birthday</th>
								</tr>
							</thead>
							<tbody>
								{userData.map((person, index) => (
									<tr key={index}>
										<td>{person.name}</td>
										<td>{person.city}</td>
										<td>{person.birthday}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</>
	);
}

export default App;
