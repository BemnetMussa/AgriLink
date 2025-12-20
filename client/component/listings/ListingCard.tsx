type ListingCardProps = {
  title: string;
  price: number;
  image: string;
};

export default function ListingCard({
  title,
  price,
  image,
}: ListingCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <img src={image} alt={title} className="h-40 w-full object-cover" />
      <h3 className="font-semibold mt-2">{title}</h3>
      <p className="text-green-600">{price} ETB / kg</p>
    </div>
  );
}
