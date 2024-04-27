import React, { useState, useEffect } from 'react';
import RecipeCard from '../../components/recipeCard/recipeCard';
import mockData from './mockData';

function RecipeList() {
	const [recipes, setRecipes] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');

	useEffect(() => {
		// Simulate fetching data from the backend (using mockData)
		setRecipes(mockData);
	}, []);

	const handleSearch = (query) => {
		setSearchQuery(query);
	};

	const handleCategoryChange = (category) => {
		setSelectedCategory(category);
	};

	const filteredRecipes = recipes.filter((recipe) => {
		const categoryMatch = selectedCategory ? recipe.category === selectedCategory : true;
		const searchMatch = searchQuery
			? Object.values(recipe).some((value) => {
					if (Array.isArray(value)) {
						return value.some((item) =>
							item.toLowerCase().includes(searchQuery.toLowerCase())
						);
					}
					return (
						typeof value === 'string' &&
						value.toLowerCase().includes(searchQuery.toLowerCase())
					);
			  })
			: true;
		return categoryMatch && searchMatch;
	});

	return (
		<div className="flex flex-col items-center">
			<div className="join flex flex-wrap justify-between items-center">
				<div
					className={`w-full md:w-auto mb-2 md:mb-0 ${
						filteredRecipes.length <= 3 ? 'rounded-r' : ''
					}`}
				>
					<input
						className={`input input-bordered join-item ${
							filteredRecipes.length <= 3 ? 'rounded-r' : ''
						}`}
						placeholder="Search"
						value={searchQuery}
						onChange={(e) => handleSearch(e.target.value)}
					/>
				</div>
				<div className={`w-full md:w-auto mb-2 md:mb-0`}>
					<select
						className="select select-bordered join-item"
						value={selectedCategory}
						onChange={(e) => handleCategoryChange(e.target.value)}
					>
						<option value="">All Categories</option>
						<option value="Appetizer">Appetizer</option>
						<option value="Soups">Soups</option>
						<option value="Salads">Salads</option>
						<option value="Main Course">Main Course</option>
						<option value="Desserts">Desserts</option>
						<option value="Drinks">Drinks</option>
						<option value="Breakfast">Breakfast</option>
					</select>
				</div>
				<div className="w-full md:w-auto">
					<button className={`btn join-item hidden md:block`} disabled>
						Search for your favorite recipe
					</button>
				</div>
			</div>
			<div className="join flex flex-wrap justify-center gap-10 my-20">
				{filteredRecipes.length === 0 && <p>No recipes found.</p>}
				{filteredRecipes.map((recipe) => (
					<RecipeCard key={recipe.recipeID} recipe={recipe} className="m-2" />
				))}
			</div>
		</div>
	);
}

export default RecipeList;
