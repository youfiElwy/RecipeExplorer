import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import HomeHero from '../../components/homeHero/homeHero';
import RecipeList from '../../components/recipeList/recipeList';

function HomePage() {
	return (
		<>
			<Navbar />
			<div className="h-full">
				<HomeHero />

				<div className="flex flex-wrap justify-center gap-10 my-20">
					<RecipeList />
				</div>
			</div>
			<Footer />
		</>
	);
}

export default HomePage;
