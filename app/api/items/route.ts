import { NextResponse } from 'next/server';
import { scanTable } from '@/lib/dynamodb'; // Adjust path if needed

export async function GET() {
  try {
    const items = await scanTable();
    return NextResponse.json(items || []);
  } catch (error: unknown) {
    console.error("API Error fetching items:", error);
    let message = "Failed to fetch items";
    if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === 'string') {
        message = error;
    }
    return NextResponse.json(
      { message: message },
      { status: 500 }
    );
  }
}

// You can also add POST, PUT, DELETE handlers here using putItem, etc.
// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     // Add validation for the body object
//     const newItem = await putItem(body);
//     return NextResponse.json(newItem, { status: 201 });
//   } catch (error: any) {
//      console.error("API Error creating item:", error);
//      return NextResponse.json(
//        { message: error.message || "Failed to create item" },
//        { status: 500 }
//      );
//   }
// } 