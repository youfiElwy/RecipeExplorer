import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import MyRecipeList from '../../components/myRecipeList/myRecipeList';

function MyRecipesPage() {
	return (
		<>
			<Navbar />
			<div className="h-full">
				<div className="flex flex-wrap justify-center gap-10 my-20">
					<MyRecipeList />
				</div>
			</div>
			<Footer />
		</>
	);
}

export default MyRecipesPage;
