import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClickIcon from '../../assets/svg/click';
import mockData from '../../components/recipeList/mockData';
import axios from 'axios';
import RecipeDetailsSkeleton from '../recipeDetailsSkeleton/recipeDetailsSkeleton';

function RecipeDetailsPage() {
	const navigate = useNavigate();
	const { id } = useParams(); // Get recipe ID from URL parameter
	const [recipe, setRecipe] = useState(null); // State to store the fetched recipe
	const [editedRecipe, setEditedRecipe] = useState(null); // State to store the edited recipe data
	const [isEditing, setIsEditing] = useState(false); // State to manage editing mode
	const [newIngredient, setNewIngredient] = useState(''); // State to store new ingredient
	const [isDeleting, setIsDeleting] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	// Image upload stuff.
	const [file, setFile] = useState(null);
	const [added, setAdded] = useState(false); // State to track if an image is added

	// Check if the current user is the creator of the recipe
	// const isCurrentUserRecipeOwner = currentUser === recipe.userID;
	const [isCurrentUserRecipeOwner, setIsCurrentUserRecipeOwner] = useState(false);

	useEffect(() => {
		// Simulate fetching recipe from backend based on ID
		async function fetchData() {
			// getting recipe by id /get/:id
			const response = await axios.get('http://localhost:5000/recipe/get/' + id, {
				withCredentials: true,
			});

			var userID = decodeURIComponent(document.cookie).split(':')[3];
			userID = userID.substring(1, userID.length - 2);
			setIsCurrentUserRecipeOwner(userID === response.data.userID);

			if (response.status === 200) {
				setRecipe(response.data);
				setEditedRecipe({ ...response.data }); // Initialize editedRecipe with fetched recipe data
			} else {
				alert('Recipe not found. Please try again.');
				navigate('/home');
			}
		}
		fetchData();
	}, [isSaving]);

	const handleEditClicked = () => {
		// Set editing mode to true
		setAdded(false); // Reset added state when editing
		setEditedRecipe({ ...recipe }); // Reset editedRecipe to the original recipe data
		setIsEditing(!isEditing);
	};

	const handleSaveClicked = () => {
		setIsSaving(true);
		// Check if any inputs are empty
		if (
			editedRecipe.title.trim() === '' ||
			editedRecipe.category.trim() === '' ||
			editedRecipe.description.trim() === '' ||
			editedRecipe.ingredients.length === 0 ||
			editedRecipe.ingredients.some((ingredient) => ingredient.trim() === '')
		) {
			alert('Please fill in all fields and ensure the ingredients list is not empty.');
			setIsSaving(false);
			return;
		}

		// Check if a new image has been added
		const updatedImage = added ? file : recipe.image;

		// Update the edited recipe with the new image
		const updatedRecipe = { ...editedRecipe };

		async function updateRecipe() {
			// updating recipe by id /update/:id
			const body = {
				title: updatedRecipe.title,
				description: updatedRecipe.description,
				category: updatedRecipe.category,
				ingredients: updatedRecipe.ingredients,
				image: updatedImage,
			};
			const response = await axios.put('http://localhost:5000/recipe/update/' + id, body, {
				headers: { 'Content-Type': 'multipart/form-data' },
				withCredentials: true,
			});

			console.log(response.status);

			if (response.status === 200) {
				setIsEditing(false); // Exit editing mode
				console.log('Recipe updated successfully:', updatedRecipe);
				setRecipe(updatedRecipe);
			} else {
				alert('Failed to update recipe. Please try again.');
			}
			setIsSaving(false);
		}
		updateRecipe();

		// Simulated API call to save edited recipe data

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
		async function deleteRecipe() {
			setIsDeleting(true);
			// deleting recipe by id /delete/:id
			const response = await axios
				.delete('http://localhost:5000/recipe/delete/' + id, {
					withCredentials: true,
				})
				.then((response) => {
					if (response.status === 200) {
						console.log('Recipe deleted successfully:', recipe.recipeID);
						// Redirect to the home page or another page after deleting the recipe
						navigate('/home');
						setIsDeleting(false);
					}
				});
		}

		deleteRecipe();
	};

	const handleProfilePicUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) {
			setAdded(false);
			return;
		}
		setFile(file);
		setAdded(true);
	};

	if (!recipe) {
		return (
			<>
				<div className="h-screen flex items-center justify-center">
					<RecipeDetailsSkeleton />
				</div>
			</>
		);
	}

	return (
		<>
			<div className="h-full">
				<div className="hero min-h-screen">
					<div className="hero-content flex-col lg:flex-row-reverse">
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
												src={URL.createObjectURL(file)}
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
									{isCurrentUserRecipeOwner && (
										<button
											className="btn btn-xs btn-outline btn-error"
											onClick={handleDeleteRecipeClicked}
											disabled={isDeleting || isSaving}
										>
											{isDeleting ? 'Deleting Recipe' : 'Delete Recipe'}
											{isDeleting && (
												<span className="loading loading-spinner loading-xs"></span>
											)}
										</button>
									)}
								</div>
								<div className="flex justify-between items-center">
									<p className="text-xs">{'Created by ' + recipe.userName}</p>
									{isCurrentUserRecipeOwner && (
										<button
											className="btn btn-xs btn-outline btn-primary mr-1"
											onClick={handleEditClicked}
											disabled={isSaving || isDeleting}
										>
											{isEditing ? 'Cancel' : 'Edit Recipe'}
										</button>
									)}
									{isEditing && (
										<button
											className="btn btn-xs btn-outline btn-primary"
											onClick={handleSaveClicked}
											disabled={isSaving || isDeleting}
										>
											{isSaving ? 'Saving' : 'Save'}
											{isSaving && (
												<span className="loading loading-spinner loading-xs"></span>
											)}
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
