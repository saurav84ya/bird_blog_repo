import Image from "next/image";
import home_bird from "../../public/img/home_bird.png";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row items-center px-5 lg:px-[15%] gap-8 h-[calc(100dvh-4rem)]">
      {/* Left Section */}
      <div className="md:w-2/3 flex flex-col justify-center text-center md:text-left mt-10 md:mt-0">
        <p className="text-xs text-orange-500 uppercase tracking-widest special-word">
          Protect All the Birds
        </p>
        <h1 className="pb-5 text-3xl md:text-5xl font-bold leading-tight">
        The World&apos;s <span className="text-orange-500 special-word">Rarest</span> <br /> Birds
        </h1>
        <p className="text-gray-600 leading-relaxed max-w-md mx-auto md:mx-0">
          Millions of birds face the threat of extinction every year, but the rarest among them need our urgent attention. Protecting these magnificent creatures is not just about saving a species—it’s about preserving the delicate balance of our ecosystem for future generations.
        </p>
      </div>

      {/* Right Section - Image */}
      <div className="md:w-1/3 flex justify-center">
        <Image
          src={home_bird}
          alt="Illustration of a rare bird in nature"
          sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
          className="w-44 sm:w-80 md:w-full max-w-xs md:max-w-sm h-auto"
          priority // Improves loading performance
        />
      </div>
    </div>
  );
}
