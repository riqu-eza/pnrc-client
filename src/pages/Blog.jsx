
import { Link } from "react-router-dom";

export const Blog = () => {
  const blogs = [
    { id: 1, name: "Travel", img: "/images/blogtravel.jpg" },
    { id: 2, name: "Business", img: "/images/blogbusiness.jpg" },
    { id: 3, name: "Culture", img: "/images/blogculture.jpg" },
  ];

  return (
    <div
      className="h-screen flex flex-col text-pink-500"
      style={{
        backgroundImage: `url(/images/palmnazilogkg.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} // Added background styling
    >
      {/* <h3 className="text-2xl text-center p-2 text-blue-400 ">
        This Blog is to share and interact in Travel, Business, and Culture
        space at our Resort Cities. Every Voice, advice, and concern matters
        here. Enjoy browsing our blog and please give feedback or leave a
        comment.
      </h3> */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4 w-full max-w-screen-lg mx-auto">
          {blogs.map((stat) => (
            <div key={stat.id} className=" p-6 rounded-lg">
              <Link
                to={{
                  pathname: `/blog/${stat.name}`,
                }}
                state={{ img: stat.img, name: stat.name }} // Pass state like this
              >
                <div className="items-center flex mt-52 flex-col">
                  <h2
                    className="relative text-4xl text-black rounded-full w-full text-center p-2 font-extrabold mt-4"
                    style={{ overflow: "hidden" }} // Ensure blur doesn't overflow the h2 boundaries
                  >
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundImage: `url(${stat.img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "blur(1px)", // Apply the blur effect to the background image
                        // Position the blurred image behind the text
                      }}
                    ></span>
                    <span className="relative z-10">{stat.name}</span>{" "}
                    {/* The text remains clear */}
                  </h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
