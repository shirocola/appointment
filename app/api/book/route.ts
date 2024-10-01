import { NextResponse } from 'next/server';
import sendgrid from '@sendgrid/mail';

// Set the SendGrid API Key from the environment variable
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  throw new Error('SENDGRID_API_KEY is not defined');
}
sendgrid.setApiKey(apiKey);

export async function POST(request: Request) {
  try {
    // Parse the request JSON
    const { date, time, food } = await request.json();

    // Validate request data
    if (!date || !time || !food) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Image URL for the selected food (assuming images are available publicly)
    const imageUrl = `${process.env.BASE_URL}/images/${food}.jpg`;

    // Construct the email message with a responsive HTML template
    const msg = {
      to: process.env.RECIPIENT_EMAIL, // Receiver email (ensure this is set in the .env file)
      from: 'kitpivatpiromgit@gmail.com', // Use an email address that is verified with SendGrid
      subject: 'New Appointment Booked',
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
          }
          .food-image {
            max-width: 300px;
            height: auto;
            margin: 20px auto;
            border-radius: 8px;
          }
          .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 15px;
            background-color: #4CAF50;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Confirmed</h1>
          </div>
          <div>
            <p>Dear K.Pear,</p>
            <p>Your appointment has been successfully booked with the following details:</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Food Selection:</strong> ${food.charAt(0).toUpperCase() + food.slice(1)}</p>
            <img src="${imageUrl}" alt="${food}" class="food-image" />
            <p>Thank you for booking with us!</p>
          </div>
        </div>
      </body>
      </html>
      `,
    };

    // Send the email
    await sendgrid.send(msg);

    return NextResponse.json({ message: 'Appointment booked successfully!' }, { status: 200 });
  } catch (error: any) {
    // Log the error and its details
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('Error details:', error.response.body);
    }

    return NextResponse.json({ error: 'Error booking the appointment' }, { status: 500 });
  }
}
