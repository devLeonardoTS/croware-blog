import React from "react";
// import dftStyles from "./Carousel.module.css";

export default function Carousel() {
	return (
		<div id="default-carousel" className="relative" data-carousel="slide">
			<div className="relative h-56 overflow-hidden rounded-lg md:h-96">
				<div
					className="duration-700 ease-in-out absolute inset-0 transition-all transform translate-x-0 z-20"
					data-carousel-item=""
				>
					<span className="absolute text-2xl font-semibold text-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 sm:text-3xl dark:text-gray-800">
						First Slide
					</span>
					<div className="flex animate-pulse justify-center items-center w-full h-full bg-gray-300 rounded dark:bg-gray-700">
						<svg
							className="w-12 h-12 text-gray-200"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
							fill="currentColor"
							viewBox="0 0 640 512"
						>
							<path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
						</svg>
					</div>
					{/* <img
            src=""
            className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            alt="..."
          ></img> */}
				</div>
				<div
					className="duration-700 ease-in-out absolute inset-0 transition-all transform translate-x-full z-10"
					data-carousel-item=""
				>
					<div className="flex animate-pulse justify-center items-center w-full h-full bg-gray-300 rounded dark:bg-gray-700">
						<svg
							className="w-12 h-12 text-gray-200"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
							fill="currentColor"
							viewBox="0 0 640 512"
						>
							<path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
						</svg>
					</div>
					{/* <img
            src=""
            className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            alt="..."
          ></img> */}
				</div>
				<div
					className="duration-700 ease-in-out absolute inset-0 transition-all transform -translate-x-full z-10"
					data-carousel-item=""
				>
					<div className="flex animate-pulse justify-center items-center w-full h-full bg-gray-300 rounded dark:bg-gray-700">
						<svg
							className="w-12 h-12 text-gray-200"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
							fill="currentColor"
							viewBox="0 0 640 512"
						>
							<path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
						</svg>
					</div>
					{/* <img
            src=""
            className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            alt="..."
          ></img> */}
				</div>
			</div>
			<div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
				<button
					type="button"
					className="w-3 h-3 rounded-full bg-white dark:bg-gray-800"
					aria-current="true"
					aria-label="Slide 1"
					data-carousel-slide-to="0"
				></button>
				<button
					type="button"
					className="w-3 h-3 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800"
					aria-current="false"
					aria-label="Slide 2"
					data-carousel-slide-to="1"
				></button>
				<button
					type="button"
					className="w-3 h-3 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800"
					aria-current="false"
					aria-label="Slide 3"
					data-carousel-slide-to="2"
				></button>
			</div>
			<button
				type="button"
				className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
				data-carousel-prev=""
			>
				<span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
					<svg
						aria-hidden="true"
						className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M15 19l-7-7 7-7"
						></path>
					</svg>
					<span className="sr-only">Previous</span>
				</span>
			</button>
			<button
				type="button"
				className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
				data-carousel-next=""
			>
				<span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
					<svg
						aria-hidden="true"
						className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M9 5l7 7-7 7"
						></path>
					</svg>
					<span className="sr-only">Next</span>
				</span>
			</button>
		</div>
	);
}
