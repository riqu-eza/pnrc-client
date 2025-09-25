import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import About from "./pages/About";
import PrivateRoute from "./components/PrivateRoute";
import UpdateListing from "./pages/UpdateListing";
import Bussinesspage from "./pages/bussinesspage";
import ListingsByCounty from "./pages/Listingbycounty";
import Countylisting from "./pages/countylisting";
import Bloglisting from "./pages/bloglisting";
import AdminImageUploadPage from "./components/AdminImagesCreate";
import Search from "./pages/Search";
import Admin from "./components/Admin";
import City from "./pages/city";
import Footer from "./components/Footer";
import AppLayout from "./components/Applayout";
import { UserProvider } from "./components/Adminuser";
import CreateBusinessListing from "./components/businessadmin";
import BusinesscityPage from "./pages/BusinesscityPage";
import Product from "./pages/Product";
import BusinessDetailPage from "./pages/businesslisting";
// import BlogPage from "./pages/Blogpage";
import { Blog } from "./pages/Blog";
import BlogPage from "./pages/Blogpage";
import ViewBusiness from "./components/viewBusiness";
import ViewListing from "./components/viewlisting";
import CreateListing from "./pages/CreateListing";
import PropertyForm from "./admin/PropertyForm";
import CategorySearch from "./pages/Categorysearch/Categorysearch";
import Letters from "./admin/Letter";
import AccommodationListingPage from "./pages/Categorylisting/listing/AccomodationListing";
import DiningListingPage from "./pages/Categorylisting/listing/DiningLisiting";
import EntertainmentListingPage from "./pages/Categorylisting/listing/entertainmentlisting";
import Culture_and_HistoricalsitesListingPage from "./pages/Categorylisting/listing/Culture_and_HistoricalsiteListingPage";
import ShoppingListingPage from "./pages/Categorylisting/listing/ShoppingListingPage";
import ServicesListingPage from "./pages/Categorylisting/listing/ServicesListingPage";
import Education_and_LearningListingPage from "./pages/Categorylisting/listing/Education_and_LearningListingPage";
export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AppLayout />}>
            <Route path="/getstarted" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />}>
              {" "}
            </Route>
            <Route path="/bussinesspage" element={<Bussinesspage />} />
            <Route path="/about" element={<About />} />
            <Route path="/resortcities" element={<ListingsByCounty />} />
            <Route path="/business/:city" element={<BusinesscityPage />} />
            <Route
              path="/businesslisting/:id"
              element={<BusinessDetailPage />}
            ></Route>
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/listings/:county" element={<Countylisting />}></Route>
            <Route path="/blogspage" element={<Blog />}></Route>
            <Route path="/blog/:name" element={<BlogPage />}></Route>
            <Route path="/addimage" element={<AdminImageUploadPage />}></Route>
            <Route
              path="/listings/:county/:categoryname"
              element={<CategorySearch />}
            />
            <Route path="/search" element={<Search />}></Route>
            <Route path="/addcity" element={<City />}></Route>
            <Route path="/admin" element={<Admin />}></Route>
            <Route path="/addblog" element={<Bloglisting />}></Route>
            <Route path="/createlisting" element={<CreateListing />} />
            <Route path="/link1" element={<CreateBusinessListing />}></Route>
            <Route path="/viewBusiness" element={<ViewBusiness />}></Route>
            <Route path="/viewlisting" element={<ViewListing />}></Route>
            <Route path="/property" element={<PropertyForm />}></Route>
            <Route
              path="/:county/accommodation/:listingid"
              element={<AccommodationListingPage />}
            ></Route>
            <Route
              path="/:county/dining/:listingid"
              element={<DiningListingPage />}
            >
              {" "}
            </Route>
            <Route
              path="/:county/culture_and_Historicalsites/:listingid"
              element={<Culture_and_HistoricalsitesListingPage />}
            ></Route>
            <Route
              path="/:county/shopping/:listingid"
              element={<ShoppingListingPage />}
            ></Route>

            <Route
              path="/:county/services/:listingid"
              element={<ServicesListingPage />}
            ></Route>

            <Route
              path="/:county/education_and_Learning/:listingid"
              element={<Education_and_LearningListingPage />}
            ></Route>
            <Route
              path="/:county/entertainment/:listingid"
              element={<EntertainmentListingPage />}
            ></Route>

            <Route path="/viewletters" element={<Letters />}></Route>
          </Route>
          {/* <Route path="/listing/:listingId" element={<Listing />} /> */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route
              path="/update-listing/:listingId"
              element={<UpdateListing />}
            />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
}
