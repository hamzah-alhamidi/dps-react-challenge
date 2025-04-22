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
	const [debouncedNameFilter, setDebouncedNameFilter] = useState('');
	const [cityFilter, setCityFilter] = useState('');
	const [uniqueCities, setUniqueCities] = useState<string[]>([]);
	const [highlightOldest, setHighlightOldest] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [oldestPerCity, setOldestPerCity] = useState<Record<string, string>>(
		{}
	);

	// Fetch users on initial load
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

				// Calculate oldest person per city
				const oldest: Record<string, string> = {};

				cities.forEach((city) => {
					const cityUsers = transformedData.filter(
						(user) => user.city === city
					);
					let oldestUser = cityUsers[0];

					for (const user of cityUsers) {
						const oldestDate = new Date(
							oldestUser.birthday.split('.').reverse().join('-')
						);
						const currentDate = new Date(
							user.birthday.split('.').reverse().join('-')
						);
						if (currentDate < oldestDate) {
							oldestUser = user;
						}
					}

					oldest[city] = oldestUser.name;
				});

				setOldestPerCity(oldest);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching users:', error);
				setIsLoading(false);
			}
		};

		fetchUsers();
	}, []);

	// Debounce the name filter
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedNameFilter(nameFilter);
		}, 1000);

		return () => clearTimeout(timer);
	}, [nameFilter]);

	// Filter data when filters change
	useEffect(() => {
		let filtered = userData;

		if (debouncedNameFilter) {
			filtered = filtered.filter((user) =>
				user.name
					.toLowerCase()
					.includes(debouncedNameFilter.toLowerCase())
			);
		}

		if (cityFilter) {
			filtered = filtered.filter((user) => user.city === cityFilter);
		}

		setFilteredData(filtered);
	}, [debouncedNameFilter, cityFilter, userData]);

	// Function to determine if a person is the oldest in their city
	const isOldest = (person: User) =>
		highlightOldest && oldestPerCity[person.city] === person.name;

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
							onChange={(e) => setNameFilter(e.target.value)}
						/>
					</div>
					<div className="control-item">
						<label htmlFor="cityFilter">City</label>
						<select
							id="cityFilter"
							className="city-dropdown"
							value={cityFilter}
							onChange={(e) => setCityFilter(e.target.value)}
						>
							<option value="">Select city</option>
							{uniqueCities.map((city) => (
								<option key={city} value={city}>
									{city}
								</option>
							))}
						</select>
					</div>
					<div className="control-item checkbox-container">
						<label
							htmlFor="highlightOldest"
							className="checkbox-label"
						>
							<input
								type="checkbox"
								id="highlightOldest"
								checked={highlightOldest}
								onChange={(e) =>
									setHighlightOldest(e.target.checked)
								}
							/>
							<span
								style={{ textAlign: 'left', display: 'block' }}
							>
								Highlight oldest
								<br />
								per city
							</span>
						</label>
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
									<tr
										key={index}
										className={
											isOldest(person)
												? 'highlighted'
												: ''
										}
									>
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
