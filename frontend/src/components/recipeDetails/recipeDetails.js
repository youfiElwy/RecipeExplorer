import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClickIcon from '../../assets/svg/click';
import mockData from '../../components/recipeList/mockData';

function RecipeDetailsPage() {
	const { id } = useParams(); // Get recipe ID from URL parameter
	const [recipe, setRecipe] = useState(null); // State to store the fetched recipe

	useEffect(() => {
		// Simulate fetching recipe from backend based on ID
		const fetchedRecipe = mockData.find((item) => item.recipeID === parseInt(id));

		if (fetchedRecipe) {
			setRecipe(fetchedRecipe);
		}
	}, [id]);

	if (!recipe) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<div className="h-full">
				<div className="hero min-h-screen">
					<div className="hero-content flex-col lg:flex-row-reverse">
						<img
							src={recipe.image}
							alt="recipeImage"
							className="w-96 xl:w-1/2 rounded-lg shadow-2xl"
						/>
						<div>
							<div className="card-body">
								<h1 className="text-5xl font-bold">{recipe.title}</h1>
								<div className="badge badge-accent">{recipe.category}</div>
								<p className="text-xs">{'Created by ' + recipe.userName}</p>
								<h2 className="card-title mt-8 text-3xl">Description</h2>
								<p>{recipe.description}</p>
								<div className="card-actions justify-end">
									<div className="collapse bg-base-200">
										<input type="checkbox" />
										<div className="collapse-title text-xl font-medium flex items-center">
											<span className="mr-4">Click to view Ingredients</span>
											<ClickIcon />
										</div>
										<div className="collapse-content">
											{recipe.ingredients.map((ingredient, index) => (
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
