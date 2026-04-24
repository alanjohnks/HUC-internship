import Navbar from "../components/Navbar";
import Gallery from "../components/Gallery";
import VenueDetails from "../components/VenueDetails";
import BookingCard from "../components/BookingCard";
import Footer from "../components/Footer";
import { getVenueData } from "../data/venueDummyData";

export default function Page() {
  const data = getVenueData();

  return (
    <>
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-8 py-12">
        <Gallery images={data.images} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <VenueDetails data={data} />
          </div>

          <BookingCard price={data.price} />
        </div>
      </main>

      <Footer />
    </>
  );
}