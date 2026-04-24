import Navbar from "@/app/components/Navbar";
import Gallery from "@/app/components/Gallery";
import VenueDetails from "@/app/components/VenueDetails";
import BookingCard from "@/app/components/BookingCard";
import Footer from "@/app/components/Footer";

async function getVenue(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/venues/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

export default async function Page({ params }: { params: { id: string } }) {
  const data = await getVenue(params.id);

  if (!data) {
    return <div className="p-10">Venue not found</div>;
  }

  return (
    <>
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-8 py-12">
        <Gallery images={data.images || []} />

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