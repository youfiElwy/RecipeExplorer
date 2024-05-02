function RecipeCardSkeleton() {
	return (
		<>
			<div className="hero h-screen">
				<div className="hero-content flex-col-reverse gap-16 lg:flex-row">
					<div>
						<div className="skeleton w-80 h-20"></div>
						<div className="flex justify-between my-2">
							<div className="skeleton h-4 w-20"></div>
							<div className="skeleton h-4 w-20"></div>
						</div>
						<div className="flex justify-between my-2">
							<div className="skeleton h-4 w-20"></div>
							<div className="skeleton h-4 w-20"></div>
						</div>

						<div className="my-16"></div>

						<div className="skeleton w-60 h-10"></div>
						<div className="skeleton h-4 w-full mt-2"></div>

						<div className="skeleton w-50 h-16 mt-2"></div>
					</div>
					<div className="skeleton h-96 w-96"></div>
				</div>
			</div>
		</>
	);
}

export default RecipeCardSkeleton;
