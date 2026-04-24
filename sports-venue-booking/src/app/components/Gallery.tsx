export default function Gallery({ images }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] mb-16">
      <div className="md:col-span-2 md:row-span-2 rounded-xl overflow-hidden">
        <img src={images[0]} className="w-full h-full object-cover" />
      </div>

      <div className="rounded-xl overflow-hidden">
        <img src={images[1]} className="w-full h-full object-cover" />
      </div>

      <div className="rounded-xl overflow-hidden">
        <img src={images[1]} className="w-full h-full object-cover" />
      </div>

      <div className="md:col-span-2 rounded-xl overflow-hidden">
        <img src={images[0]} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}