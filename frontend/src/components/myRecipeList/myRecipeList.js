import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../../components/recipeCard/recipeCard';
import mockData from '../recipeList/mockData';
import axios from 'axios';

function MyRecipeList() {
	const navigate = useNavigate();
	const [recipes, setRecipes] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');

	useEffect(() => {
		async function fetchData() {
			const response = await axios.get('http://localhost:5000/recipe/getuserrecipes', { withCredentials: true });
			if (response.status != 200 && response.data && response.data.error) {
				alert('Failed to fetch recipes. Please try again.');
				console.error(response.data.error);
				return;
			}
			for (let i = 0; i < response.data.length; i++) {
				response.data[i].ingredients = response.data[i].ingredients.split(",");
			}
			setRecipes(response.data);
		}
		fetchData();
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
						Search your created recipes
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

export default MyRecipeList;
