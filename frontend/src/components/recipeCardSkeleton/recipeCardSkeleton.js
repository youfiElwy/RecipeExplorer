function RecipeCardSkeleton() {
	return (
		<>
			<div className="flex flex-col gap-4 w-80">
				<div className="skeleton h-52 w-full"></div>
				<div className="p-3 flex flex-col gap-4 w-80">
					<div className="skeleton h-4 w-40"></div>
					<div className="skeleton h-4 w-28"></div>
					<div className="skeleton h-4 w-full"></div>
					<div className="skeleton h-4 w-full"></div>
					{/* put the dib at the right side position */}

					<div className="self-end flex flex-row gap-2">
						<div className="skeleton h-4 w-20"></div>
						<div className="skeleton h-4 w-20"></div>
					</div>
				</div>
			</div>
		</>
	);
}

export default RecipeCardSkeleton;
