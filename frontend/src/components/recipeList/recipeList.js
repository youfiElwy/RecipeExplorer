import React, { useState, useEffect } from 'react';
import RecipeCard from '../../components/recipeCard/recipeCard';
import mockData from './mockData';
import axios from 'axios';
import RecipeCardSkeleton from '../recipeCardSkeleton/recipeCardSkeleton';

function RecipeList() {
	const [recipes, setRecipes] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			const response = await axios.get('http://3.85.237.180:5000/recipe/getall', {
				withCredentials: true,
			});
			if (response.data && response.data.error) {
				alert('Failed to fetch recipes. Please try again.');
				console.error(response.data.error);
				return;
			}
			setRecipes(response.data);
			setIsLoading(false);
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
						Search for your favorite recipe
					</button>
				</div>
			</div>

			{!isLoading ? (
				<div className="join flex flex-wrap justify-center gap-10 my-20">
					{filteredRecipes.length === 0 && (
						<div className="h-screen">
							<div role="alert" className="alert alert-warning">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="stroke-current shrink-0 h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
								<span>No recipes found!</span>
							</div>
						</div>
					)}
					{filteredRecipes.map((recipe) => (
						<RecipeCard key={recipe.recipeID} recipe={recipe} className="m-2" />
					))}
				</div>
			) : (
				<div className="join flex flex-wrap justify-center gap-10 my-20">
					{Array(12)
						.fill()
						.map((_, index) => (
							<RecipeCardSkeleton key={index} />
						))}
				</div>
			)}
		</div>
	);
}

export default RecipeList;
