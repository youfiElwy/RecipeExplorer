import { useNavigate } from 'react-router-dom';

function RecipeCard({ recipe }) {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/recipe/${recipe.recipeID}`); // Navigate to recipe details page with the recipe ID
	};

	return (
		<>
			<div
				className="card w-80 overflow-hidden hover:shadow-xl transform hover:scale-105 transition-transform duration-300 cursor-pointer"
				onClick={handleClick}
			>
				<figure className="h-56 w-full overflow-hidden">
					<img
						src={recipe.image}
						alt="recipeImage"
						className="h-full w-full object-cover transition-opacity duration-300 hover:opacity-90"
					/>
				</figure>
				<div className="card-body">
					<h2 className="card-title">{recipe.title}</h2>
					<div className="badge badge-accent">{recipe.category}</div>
					<p>{recipe.description}</p>
					<div className="card-actions justify-end">
						{recipe.ingredients.length <= 3 ? (
							// If there are 3 or fewer ingredients, display them
							recipe.ingredients.map((ingredient, index) => (
								<div key={index} className="badge badge-outline">
									{ingredient}
								</div>
							))
						) : (
							// If there are more than 3 ingredients, display the first 3 followed by ". . ."
							<>
								{recipe.ingredients.slice(0, 3).map((ingredient, index) => (
									<div key={index} className="badge badge-outline">
										{ingredient}
									</div>
								))}
								<div className="badge badge-outline">. . .</div>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default RecipeCard;
