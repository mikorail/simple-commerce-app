// app/thank-you/page.tsx

import React from 'react';

const ThankYouPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold text-center mb-4">Thank You!</h1>
      <p className="text-lg text-center mb-2">
        Your purchase was failed. please try again dont worry we will fix it soon!
      </p>
      <p className="text-lg text-center">
        You will receive a confirmation email shortly.
      </p>
      <a href="/" className="mt-4 text-blue-500 hover:underline">
        Go back to homepage
      </a>
    </div>
  );
};

export default ThankYouPage;
