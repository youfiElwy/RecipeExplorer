import { useState, useEffect, useNavigate } from 'react';
import { useParams } from 'react-router-dom';
import ClickIcon from '../../assets/svg/click';
import mockData from '../../components/recipeList/mockData';
import axios from 'axios';

function RecipeDetailsPage() {
	const navigate = useNavigate();
	const { id } = useParams(); // Get recipe ID from URL parameter
	const [recipe, setRecipe] = useState(null); // State to store the fetched recipe
	const [editedRecipe, setEditedRecipe] = useState(null); // State to store the edited recipe data
	const [isEditing, setIsEditing] = useState(false); // State to manage editing mode
	const [newIngredient, setNewIngredient] = useState(''); // State to store new ingredient

	// Image upload stuff.
	const [addImage, setAddImage] = useState({ myFile: '' }); // State to store the uploaded image
	const [added, setAdded] = useState(false); // State to track if an image is added

	// Check if the current user is the creator of the recipe
	// const isCurrentUserRecipeOwner = currentUser === recipe.userID;
	const isCurrentUserRecipeOwner = true;

	useEffect(() => {
		// Simulate fetching recipe from backend based on ID
		async function fetchData() {// getting recipe by id /get/:id
			const response = await axios.get('http://localhost:5000/recipe/get/' + id, { withCredentials: true });
			
			if (response.data.error) {
				alert('Failed to fetch recipe. Please try again.');
				console.error(response.data.error);
				navigate('/home');
				return;
			}

			response.data.ingredients = response.data.ingredients.split(",");

			return response.data;
		}
		const fetchedRecipe = fetchData();
		
		if (fetchedRecipe) {
			setRecipe(fetchedRecipe);
			setEditedRecipe({ ...fetchedRecipe }); // Initialize editedRecipe with fetched recipe data
		}
	}, [id]);

	const handleEditClicked = () => {
		// Set editing mode to true
		setEditedRecipe({ ...recipe }); // Reset editedRecipe to the original recipe data
		setIsEditing(!isEditing);
	};

	const handleSaveClicked = () => {
		// Check if any inputs are empty
		if (
			editedRecipe.title.trim() === '' ||
			editedRecipe.category.trim() === '' ||
			editedRecipe.description.trim() === '' ||
			editedRecipe.ingredients.length === 0 ||
			editedRecipe.ingredients.some((ingredient) => ingredient.trim() === '')
		) {
			alert('Please fill in all fields and ensure the ingredients list is not empty.');
			return;
		}

		// Check if a new image has been added
		const updatedImage = added ? addImage.myFile : recipe.image;

		// Update the edited recipe with the new image
		const updatedRecipe = { ...editedRecipe, image: updatedImage };

		async function updateRecipe() {// updating recipe by id /update/:id
			const response = await axios.get('http://localhost:5000/recipe/' + id, { withCredentials: true });

			return response.data;
		}

		// Simulated API call to save edited recipe data
		if (updateRecipe()) {
			console.log('Recipe updated successfully:', updatedRecipe);
			setRecipe(updatedRecipe);
			setIsEditing(false); // Exit editing mode
		} else {
			alert('Failed to update recipe. Please try again.');
		}

		// Here you would make an API call to save the editedRecipe data
		// Once the API call is successful, you can update the recipe state if needed
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		// If the input is the category dropdown, handle it differently
		if (name === 'category') {
			setEditedRecipe((prevRecipe) => ({
				...prevRecipe,
				[name]: value,
			}));
		} else {
			setEditedRecipe((prevRecipe) => ({
				...prevRecipe,
				[name]: value,
			}));
		}
	};

	const handleAddIngredient = () => {
		if (newIngredient.trim() !== '') {
			setEditedRecipe((prevRecipe) => ({
				...prevRecipe,
				ingredients: [...prevRecipe.ingredients, newIngredient.trim()],
			}));
			setNewIngredient(''); // Clear the input field after adding ingredient
		}
	};

	const handleDeleteIngredient = (index) => {
		setEditedRecipe((prevRecipe) => ({
			...prevRecipe,
			ingredients: prevRecipe.ingredients.filter((_, i) => i !== index),
		}));
	};

	const handleDeleteRecipeClicked = () => {
		async function deleteRecipe() {// deleting recipe by id /delete/:id
			const response = await axios.get('http://localhost:5000/recipe/delete/' + id, { withCredentials: true });

			return response.data;
		}

		if (deleteRecipe()) {
			console.log('Recipe deleted successfully:', recipe.recipeID);
			// Redirect to the home page or another page after deleting the recipe
			navigate('/home'); // Redirect to the home page
		}

		console.log('Deleting recipe with ID:', recipe.recipeID);
	};

	const convertToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.onload = () => {
				resolve(fileReader.result);
			};
			fileReader.onerror = (error) => {
				reject(error);
			};
		});
	};

	const handleProfilePicUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) {
			setAddImage({ myFile: '' });
			setAdded(false);
			return;
		}
		const base64 = await convertToBase64(file);
		setAddImage({ ...addImage, myFile: base64 });
		setAdded(true);
	};

	if (!recipe) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<div className="h-full">
				<div className="hero min-h-screen">
					<div className="hero-content flex-col lg:flex-row-reverse">
						{/* Updated image upload */}
						{!isEditing ? (
							<div className="w-96 h-96 overflow-hidden rounded-3xl shadow-2xl">
								<img
									src={recipe.image}
									alt="recipeImage"
									className="w-full h-full object-cover"
								/>
							</div>
						) : (
							<div className="profilePic">
								<label htmlFor="file-upload">
									{!added ? (
										<div className="w-96 h-96 overflow-hidden rounded-3xl shadow-2xl">
											<img
												src={recipe.image}
												alt="recipeImage"
												className="w-full h-full object-cover"
											/>
										</div>
									) : (
										<div className="w-96 h-96 overflow-hidden rounded-3xl shadow-2xl">
											<img
												className="w-full h-full object-cover"
												src={addImage.myFile}
												alt=""
											/>
										</div>
									)}
								</label>
								<input
									className="ppInput"
									type="file"
									lable="Image"
									name="myFile"
									id="file-upload"
									accept=".jpeg, .png, .jpg"
									onChange={(e) => handleProfilePicUpload(e)}
								/>
							</div>
						)}
						{/* End of updated image upload */}

						<div>
							<div className="card-body">
								<h1 className={`text-3xl sm:text-5xl font-bold`}>
									{isEditing ? (
										<input
											className="w-full"
											type="text"
											name="title"
											value={editedRecipe.title}
											onChange={handleInputChange}
										/>
									) : (
										recipe.title
									)}
								</h1>
								<div className="flex justify-between items-center">
									{isEditing ? (
										<select
											name="category"
											value={editedRecipe.category}
											onChange={handleInputChange}
											className="select select-bordered select-xs w-full max-w-xs bg-accent"
										>
											<option disabled>Choose a category</option>
											<option value="Appetizer">Appetizer</option>
											<option value="Soups">Soups</option>
											<option value="Salads">Salads</option>
											<option value="Main Course">Main Course</option>
											<option value="Desserts">Desserts</option>
											<option value="Drinks">Drinks</option>
											<option value="Breakfast">Breakfast</option>
										</select>
									) : (
										<div className="badge badge-accent">{recipe.category}</div>
									)}
									{/* Render delete button only for recipe owner */}
									{isCurrentUserRecipeOwner && (
										<button
											className="btn btn-xs btn-outline btn-error"
											onClick={handleDeleteRecipeClicked}
										>
											Delete Recipe
										</button>
									)}
								</div>
								<div className="flex justify-between items-center">
									<p className="text-xs">{'Created by ' + recipe.userName}</p>
									{/* Render edit button only for recipe owner */}
									{isCurrentUserRecipeOwner && (
										<button
											className="btn btn-xs btn-outline btn-primary"
											onClick={handleEditClicked}
										>
											{isEditing ? 'Cancel' : 'Edit Recipe'}
										</button>
									)}
									{isEditing && (
										<button
											className="btn btn-xs btn-outline btn-primary"
											onClick={handleSaveClicked}
										>
											Save
										</button>
									)}
								</div>

								<h2 className="card-title mt-8 text-3xl">Description</h2>
								{isEditing ? (
									<textarea
										className="w-full"
										name="description"
										value={editedRecipe.description}
										onChange={handleInputChange}
										placeholder="Describe your recipe here..."
										style={{ minHeight: '100px', maxHeight: '200px' }}
										maxLength={200}
									/>
								) : (
									<p>{recipe.description}</p>
								)}
								<div className="card-actions justify-end">
									<div className="collapse bg-base-200">
										<input type="checkbox" />
										<div className="collapse-title text-xl font-medium flex items-center">
											<span className="mr-4">Click to view Ingredients</span>
											<ClickIcon />
										</div>

										{/* Text box and add button for adding new ingredients */}

										<div className="collapse-content">
											{isEditing && (
												<div className="flex flex-row items-center">
													<input
														type="text"
														placeholder="Add an ingredient"
														value={newIngredient}
														onChange={(e) => setNewIngredient(e.target.value)}
														className="input input-bordered input-sm w-full max-w-xs mb-2"
													/>
													<button
														onClick={handleAddIngredient}
														className="btn btn-outline btn-accent ml-2"
													>
														Add
													</button>
												</div>
											)}
											{isEditing
												? editedRecipe.ingredients.map((ingredient, index) => (
														<div
															key={index}
															className="badge badge-outline mr-2"
															onClick={() =>
																isEditing && handleDeleteIngredient(index)
															}
														>
															{ingredient}
														</div>
												  ))
												: recipe.ingredients.map((ingredient, index) => (
														<div key={index} className="badge badge-outline mr-2">
															{ingredient}
														</div>
												  ))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default RecipeDetailsPage;
