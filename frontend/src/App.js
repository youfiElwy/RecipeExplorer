import './App.css';

import { Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './pages/login/login';
import SignupPage from './pages/signup/signup';
import HomePage from './pages/home/home';
import MyRecipesPage from './pages/myRecipes/myRecipes';
import RecipeDetailsPage from './pages/recipe/recipe';
import CreateRecipePage from './pages/createRecipe/createRecipe';

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/home" element={<HomePage />} />
				<Route path="/myrecipes" element={<MyRecipesPage />} />
				<Route path="/recipe/:id" element={<RecipeDetailsPage />} />
				<Route path="/newrecipe" element={<CreateRecipePage />} />
			</Routes>
		</>
	);
}

export default App;

