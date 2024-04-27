import React, { useState } from 'react';
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import mockData from '../../components/recipeList/mockData';

function CreateRecipePage() {
	const [title, setTitle] = useState('');
	const [category, setCategory] = useState('');
	const [description, setDescription] = useState('');
	const [inputValue, setInputValue] = useState('');
	const [ingredients, setIngredients] = useState([]);

	const handleInputChange = (event) => {
		setInputValue(event.target.value);
	};

	const handleAddIngredient = () => {
		if (inputValue.trim() !== '') {
			setIngredients([...ingredients, inputValue.trim()]);
			setInputValue('');
		}
	};

	const handleAddRecipe = () => {
		// Check if title, description, category, and ingredients are not empty
		if (!title || !description || !category || ingredients.length === 0) {
			alert('Please fill in all fields');
			return;
		}

		// Check if the selected category is one of the available options
		const validCategories = [
			'Appetizer',
			'Soups',
			'Salads',
			'Main Course',
			'Desserts',
			'Drinks',
			'Breakfast',
		];
		if (!validCategories.includes(category)) {
			alert('Please select a valid category');
			return;
		}

		// Proceed with API call or other actions
		// For now, let's just log the recipe details
		console.log('Recipe details:', {
			title,
			category,
			description,
			ingredients,
		});

		// Clear the input fields after adding the recipe
		setTitle('');
		setDescription('');
		setCategory('');
		setIngredients([]);
	};

	return (
		<>
			<Navbar />
			<div className="h-full">
				<div className="hero min-h-screen">
					<div className="hero-content flex-col lg:flex-row-reverse">
						<img
							src={mockData[0].image}
							alt="recipeImage"
							className="w-96 xl:w-1/2 rounded-lg shadow-2xl"
						/>
						<div>
							<div className="card-body">
								<input
									type="text"
									placeholder="Recipe title"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="input input-bordered input-lg w-full max-w-xs"
								/>

								<select
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									className="select select-bordered select-xs w-full max-w-xs"
								>
									<option disabled selected>
										Choose a category
									</option>
									<option value="Appetizer">Appetizer</option>
									<option value="Soups">Soups</option>
									<option value="Salads">Salads</option>
									<option value="Main Course">Main Course</option>
									<option value="Desserts">Desserts</option>
									<option value="Drinks">Drinks</option>
									<option value="Breakfast">Breakfast</option>
								</select>

								<h2 className="card-title mt-8 text-3xl">Description</h2>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Describe your recipe here..."
									className="textarea textarea-bordered textarea-lg w-full max-w-xs"
									style={{ minHeight: '100px', maxHeight: '200px' }}
									maxLength={200}
								></textarea>

								<h2 className="card-title mt-8 text-3xl">Ingredients</h2>

								<div className="flex flex-col items-center">
									<div className="flex flex-row items-center">
										<input
											type="text"
											placeholder="Add an ingredient"
											value={inputValue}
											onChange={handleInputChange}
											className="input input-bordered input-sm w-full max-w-xs mb-2"
										/>
										<button
											onClick={handleAddIngredient}
											className="btn btn-outline btn-accent ml-2"
										>
											Add
										</button>
									</div>

									<div className="flex flex-wrap mt-2">
										{ingredients.map((ingredient, index) => (
											<div key={index} className="badge badge-outline mr-2 mb-2">
												{ingredient}
											</div>
										))}
									</div>
								</div>

								<button className="btn btn-wide btn-success" onClick={handleAddRecipe}>
									Add Recipe
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}

export default CreateRecipePage;
