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
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Image URL for the selected food (assuming images are available publicly)
    const imageUrl = `${process.env.BASE_URL}/images/${food}.jpg`; // Add BASE_URL in .env.local for your deployment

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
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
          }
          .container {
            width: 100%;
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
          .content {
            padding: 20px;
          }
          .food-image {
            width: 100%;
            max-width: 300px;
            height: auto;
            display: block;
            margin: 20px auto;
            border-radius: 8px;
          }
          .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 15px;
            text-align: center;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }
          @media (max-width: 600px) {
            .container {
              padding: 10px;
            }
            .header {
              padding: 15px;
            }
            .button {
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Confirmed</h1>
          </div>
          <div class="content">
            <p>Dear K.Pear,</p>
            <p>Your appointment has been successfully booked with the following details:</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Food Selection:</strong> ${food.charAt(0).toUpperCase() + food.slice(1)}</p>
            <img src="${imageUrl}" alt="${food}" class="food-image" />
            <a href="#" class="button">View Details</a>
            <p>Thank you for booking with us!</p>
          </div>
        </div>
      </body>
      </html>
      `,
    };

    // Send the email
    await sendgrid.send(msg);

    return new Response(JSON.stringify({ message: 'Appointment booked successfully!' }), { status: 200 });
  } catch (error: any) {
    // Log the error and its details
    console.error('Error sending email:', error);

    // Send a detailed error response
    if (error.response) {
      console.error('Error details:', error.response.body);
    }

    return new Response(JSON.stringify({ error: 'Error booking the appointment' }), { status: 500 });
  }
}
