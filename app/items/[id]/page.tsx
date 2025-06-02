import { getItemById } from '@/lib/dynamodb'; // Adjust path if needed

// This is a Server Component by default in the App Router
export default async function ItemPage({ params }: { params: { id: string } }) {
  const itemId = params.id;
  let itemData;
  let error = null;

  try {
    itemData = await getItemById(itemId);
  } catch (err: unknown) {
    console.error("Failed to fetch item:", err);
    let message = "Failed to load item data.";
    if (err instanceof Error) {
        message = err.message;
    } else if (typeof err === 'string') {
        message = err;
    }
    error = message;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>;
  }

  if (!itemData) {
    return <div className="container mx-auto p-4">Item not found.</div>;
  }

  // Replace 'title' and 'description' with your actual item attributes
  const title = (typeof itemData.title === 'string' ? itemData.title : null) || 'No Title';
  const description = (typeof itemData.description === 'string' ? itemData.description : null) || 'No Description';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p>{description}</p>
      {/* Display other item data */}
      <pre className="mt-4 bg-gray-100 p-2 rounded text-sm">
        {JSON.stringify(itemData, null, 2)}
      </pre>
    </div>
  );
}

// Optional: Add generateStaticParams if you want to pre-render pages at build time
// export async function generateStaticParams() {
//   // Fetch all item IDs (e.g., using scanTable or a more efficient query)
//   // const items = await scanTable();
//   // return items?.map((item) => ({ id: item.id })) || [];
//   return [{ id: 'example-id-1' }, { id: 'example-id-2' }]; // Example
// } 