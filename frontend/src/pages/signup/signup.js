import { Link } from 'react-router-dom';

import loginbg from '../../assets/images/loginbg.jpg';

function SignupPage() {
	return (
		<>
			<section class="mb-32">
				<div
					className="relative overflow-hidden bg-cover bg-no-repeat bg-[50%] h-[500px]"
					style={{ backgroundImage: `url(${loginbg})` }}
				></div>
				<div class="container mx-auto px-6 md:px-12 xl:px-32">
					<div class="text-center">
						<div class="mt-[-170px] block rounded-lg bg-[hsla(0,0%,100%,0.55)] bg-[hsla(0,0%,100%,0.7)] px-6 py-12 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] backdrop-blur-[30px] dark:bg-[hsla(0,0%,5%,0.55)] dark:shadow-black/20 md:py-16 md:px-12">
							<div className="hero-content flex-col lg:flex-row-reverse">
								<div className="text-center lg:text-left">
									<h1 className="text-5xl font-bold text-white">Signup now!</h1>
									<p className="py-6 text-white">
										Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
										excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a
										id nisi.
									</p>
								</div>
								<div className="card shrink-0 w-full max-w-sm">
									<form className="card-body">
										<div className="form-control">
											<label className="label">
												<span className="label-text text-white">Username</span>
											</label>
											<input
												type="text"
												placeholder="username"
												className="input input-bordered"
												required
											/>
											<label className="label">
												<span className="label-text text-white">Email</span>
											</label>
											<input
												type="email"
												placeholder="email"
												className="input input-bordered"
												required
											/>
										</div>
										<div className="form-control">
											<label className="label">
												<span className="label-text text-white">Password</span>
											</label>
											<input
												type="password"
												placeholder="password"
												className="input input-bordered"
												required
											/>
										</div>
										<div className="form-control mt-6">
											<button className="btn btn-primary text-white">Signup</button>
										</div>
										<label className="label">
											<Link to="/" className="label-text-alt link text-neutral-content">
												Already have an account? Login now!
											</Link>
										</label>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default SignupPage;
