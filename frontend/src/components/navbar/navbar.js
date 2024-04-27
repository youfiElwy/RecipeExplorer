import { Link } from 'react-router-dom';

import ProfileIcon from '../../assets/svg/profileIcon';

function Navbar() {
	return (
		<>
			<div className="navbar bg-accent">
				<div className="navbar-start">
					<div className="dropdown">
						<div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h8m-8 6h16"
								/>
							</svg>
						</div>
						<ul
							tabIndex={0}
							className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
						>
							<li>
								<Link to="/home">Home</Link>
							</li>
							<li>
								<Link to="/myrecipes">My Recipes</Link>
							</li>
							<li>
								<Link to="/newrecipe">Create new Recipe</Link>
							</li>
						</ul>
					</div>
					<Link to="/home" className="btn btn-ghost text-xl">
						Recipe Explorer
					</Link>
				</div>
				<div className="navbar-center hidden lg:flex">
					<ul className="menu menu-horizontal px-1">
						<li>
							<Link to="/home">Home</Link>
						</li>
						<li>
							<Link to="/myrecipes">My Recipes</Link>
						</li>
						<li>
							<Link to="/newrecipe">Create new Recipe</Link>
						</li>
					</ul>
				</div>
				<div className="navbar-end">
					<div className="dropdown dropdown-end">
						<div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
							<div className="w-10 rounded-full">
								<ProfileIcon />
							</div>
						</div>
						<ul
							tabIndex={0}
							className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
						>
							<li>
								<Link className="justify-between">
									Profile
									<span className="badge">New</span>
								</Link>
							</li>
							<li>
								<Link>Settings</Link>
							</li>
							<li>
								<Link>Logout</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}

export default Navbar;
