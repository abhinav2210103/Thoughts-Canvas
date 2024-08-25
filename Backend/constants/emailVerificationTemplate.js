const emailVerificationTemplate = (fullName) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .message { font-size: 18px; color: #333; }
    </style>
</head>
<body>
    <div class="message">
        <h1>Hello ${fullName},</h1>
        <h2>Your email address has been successfully verified.</h2>
    </div>
</body>
</html>
`;
module.exports = { emailVerificationTemplate };
