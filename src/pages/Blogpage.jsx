import { useState, useEffect, useRef } from "react";
import { FaEye } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import Comments from "./commentsection/Comments";

const BlogPage = () => {
  const { name } = useParams();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 11;
  const commentSectionRef = useRef(null);
  const location = useLocation();

  const { img } = location.state || {};
  const openModal = async (post) => {
    setSelectedPost(post);
    setShowModal(true);
    try {
      // Increment the view count
      await fetch(`/api/blog/view/${post._id}`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const closeModal = () => {
    setSelectedPost(null);
    setShowModal(false);
  };

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch(
          `/api/blog/allblog?name=${encodeURIComponent(name)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const data = await response.json();
        setBlogPosts(data);
        console.log(data)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [name]);

  const scrollToComments = () => {
    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Calculate the posts for the current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
    className="w-full h-auto"
    style={{
      backgroundImage: `url(${img})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  gap-6 p-8 ">
      {currentPosts.map((post) => (
        <div key={post._id} className="border p-4 bg-blue-100 m-6 rounded-lg">
          <div className="flex items-center justify-between gap-4">
            <p className="text-gray-600">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className="font-semibold">{post.title}</p>
            <p className="flex items-center gap-1 text-gray-500">
              <FaEye /> {post.views}
            </p>
            <button
              className="text-blue-500 hover:underline"
              onClick={scrollToComments}
            >
              Comments
            </button>
          </div>

          <div className="mt-2">
            {/* Check if text exists, if not, show the PDF link */}
            {post.text ? (
              <p>
                {post.text.split(" ").slice(0, 20).join(" ")}
                {post.text.split(" ").length > 20 ? "..." : ""}
                <button
                  className="text-blue-500 hover:underline ml-2"
                  onClick={() => openModal(post)}
                >
                  Read more
                </button>
              </p>
            ) : post.fileUrls && post.fileUrls.length > 0 ? (
              <button
              className="text-blue-500 hover:underline ml-2"
              onClick={() => openModal(post)}
            >
              view pdf
            </button>
            ) : (
              <p>No content available</p>
            )}
          </div>
        </div>
      ))}
      {showModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-4 rounded-lg max-w-lg overflow-y-auto border border-gray-300 m-4 mt-10 max-h-screen">
            <h2 className="text-lg font-semibold">{selectedPost.title}</h2>
            {selectedPost.text ? (
              <p className="mt-2">{selectedPost.text}</p>
            ) : (
              <a
                href={selectedPost.fileUrls[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View PDF
              </a>
            )}
            <div ref={commentSectionRef} className="mt-10">
              <Comments />
            </div>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>

    <div className="flex justify-center mt-4">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === number ? "bg-blue-500 text-white" : "bg-white text-blue-500"
            }`}
          >
            {number}
          </button>
        )
      )}
    </div>
  </div>
  );
};

export default BlogPage;
