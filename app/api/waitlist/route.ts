import { NextResponse } from 'next/server';
import { putItem } from '@/lib/dynamodb'; // Import your DynamoDB utility function

// Basic email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, company, role, submittedAt } = body;

    // --- Basic Server-Side Validation ---
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ message: 'Name is required.' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return NextResponse.json({ message: 'A valid email is required.' }, { status: 400 });
    }
    if (!submittedAt || isNaN(Date.parse(submittedAt))) {
       return NextResponse.json({ message: 'Invalid submission timestamp.' }, { status: 400 });
    }
    // Optional fields validation (type check)
    if (company && typeof company !== 'string') {
       return NextResponse.json({ message: 'Invalid company name format.' }, { status: 400 });
    }
     if (role && typeof role !== 'string') {
       return NextResponse.json({ message: 'Invalid role format.' }, { status: 400 });
    }
    // --- End Validation ---

    // Prepare item for DynamoDB
    // IMPORTANT: Use email as the primary key (id) for simplicity here,
    // assuming emails are unique for the waitlist.
    // If you need multiple signups per email or a different structure,
    // use uuidv4() for the 'id' and potentially add email as another attribute.
    const item = {
      id: email.toLowerCase(), // Use lowercase email as unique ID
      name: name.trim(),
      email: email.toLowerCase(),
      company: company?.trim() || null, // Store empty optional fields as null
      role: role?.trim() || null,
      submittedAt: submittedAt,
      // Add any other relevant fields, e.g., status: 'waitlisted'
    };

    // Save to DynamoDB using your putItem function
    await putItem(item);

    // Return success response
    return NextResponse.json({ message: 'Successfully joined waitlist!', item: item }, { status: 201 });

  } catch (error: unknown) {
    console.error("API Error saving waitlist entry:", error);

    // Generic error for the client
    const errorMessage = "Failed to join waitlist.";
    // You could check for specific DynamoDB errors if needed
    // if (error.name === 'SomeDynamoDbError') { ... }

    // Type assertion or check needed before accessing properties
    const responseMessage = errorMessage;
    if (error instanceof Error) {
        // Optionally use error.message if it's safe to expose
        // responseMessage = error.message;
    }

    return NextResponse.json({ message: responseMessage }, { status: 500 });
  }
} 