import Homebg from '../../assets/images/homebg.png';

function HomeHero() {
	return (
		<>
			<section class="mb-40 overflow-hidden">
				<div
					className="relative overflow-hidden bg-cover bg-no-repeat bg-[50%] h-[500px]"
					style={{ backgroundImage: `url(${Homebg})` }}
				>
					<div class="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-fixed bg-[hsla(0,0%,0%,0.75)]">
						<div class="flex h-full items-center justify-center">
							<div class="px-6 text-center text-white md:px-12">
								<h1 class="mt-6 mb-16 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl text-base-300">
									Welcome to Recipe Explorer
									<br />
									<span>Discover Culinary Delights!</span>
								</h1>
								<a
									class="mb-2 inline-block rounded-full border-2 border-neutral-50 px-[46px] pt-[14px] pb-[12px] text-sm font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-neutral-100 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-neutral-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 md:mr-2 md:mb-0"
									data-te-ripple-init
									data-te-ripple-color="light"
									href="#!"
									role="button"
								>
									Start Discovering
								</a>
								<a
									class="inline-block rounded-full px-12 pt-4 pb-3.5 text-sm font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-20 hover:text-neutral-200 focus:text-neutral-200 focus:outline-none focus:ring-0 active:text-neutral-300"
									data-te-ripple-init
									data-te-ripple-color="light"
									href="#!"
									role="button"
								>
									Learn more
								</a>
							</div>
						</div>
					</div>
				</div>

				<div class="-mt-2.5 text-white dark:text-neutral-800 md:-mt-4 lg:-mt-6 xl:-mt-10 h-[50px] scale-[2] origin-[top_center]">
					<svg viewBox="0 0 2880 48" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M 0 48 L 1437.5 48 L 2880 48 L 2880 0 L 2160 0 C 1453.324 60.118 726.013 4.51 720 0 L 0 0 L 0 48 Z"
							className="fill-base-100"
						></path>
					</svg>
				</div>
			</section>
		</>
	);
}

export default HomeHero;
