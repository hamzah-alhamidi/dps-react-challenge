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
	const [filteredData, setFilteredData] = useState<User[]>([]);
	const [nameFilter, setNameFilter] = useState('');
	const [cityFilter, setCityFilter] = useState('');
	const [uniqueCities, setUniqueCities] = useState<string[]>([]);
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
				setFilteredData(transformedData);

				// Extract unique cities
				const cities = [
					...new Set(transformedData.map((user) => user.city)),
				].sort();
				setUniqueCities(cities);

				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching users:', error);
				setIsLoading(false);
			}
		};

		fetchUsers();
	}, []);

	// Filter data when nameFilter or cityFilter changes
	useEffect(() => {
		let filtered = userData;

		// Apply name filter
		if (nameFilter) {
			filtered = filtered.filter((user) =>
				user.name.toLowerCase().includes(nameFilter.toLowerCase())
			);
		}

		// Apply city filter
		if (cityFilter) {
			filtered = filtered.filter((user) => user.city === cityFilter);
		}

		setFilteredData(filtered);
	}, [nameFilter, cityFilter, userData]);

	const handleNameFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNameFilter(e.target.value);
	};

	const handleCityFilterChange = (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		setCityFilter(e.target.value);
	};

	return (
		<>
			<div>
				<a href="https://www.digitalproductschool.io/" target="_blank">
					<img src={dpsLogo} className="logo" alt="DPS logo" />
				</a>
			</div>
			<div className="home-card">
				<div className="control-panel">
					<div className="control-item">
						<label htmlFor="nameFilter">Name</label>
						<input
							type="text"
							id="nameFilter"
							placeholder="Search by name"
							className="name-input"
							value={nameFilter}
							onChange={handleNameFilterChange}
						/>
					</div>
					<div className="control-item">
						<label htmlFor="cityFilter">City</label>
						<select
							id="cityFilter"
							className="city-dropdown"
							value={cityFilter}
							onChange={handleCityFilterChange}
						>
							<option value="">Select city</option>
							{uniqueCities.map((city) => (
								<option key={city} value={city}>
									{city}
								</option>
							))}
						</select>
					</div>
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
								{filteredData.map((person, index) => (
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
