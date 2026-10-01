require('dotenv').config();
const nodemailer = require('nodemailer');
const xlsx = require('xlsx');

// Load the Excel file
const workbook = xlsx.readFile('contacts.xlsx'); // Replace with your file name
const sheetName = workbook.SheetNames[0]; // Get the first sheet
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convert sheet to JSON

// Configure nodemailer with your email credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Gmail email from .env
        pass: process.env.EMAIL_PASS  // Gmail app password from .env
    }
});

// Function to send email
const sendEmail = async (companyName, name, jobRole, email) => {

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${email}`,
        subject: `APPLICATION FOR ${jobRole} at ${companyName}`,
        text: `Dear ${name},\nI am excited to apply for the ${jobRole} at ${companyName} position that was recently advertised on LinkedIn. My skills and qualifications align with your job requirements, and I am eager for the opportunity to contribute to your team.\nAttached my CV for your review. I believe that my background in development makes me a suitable candidate for this role.\n I would be happy to discuss my application further and answer any questions you may have. Please feel free to reach out to me at your convenience.\n\nKind Regards,\nShiv Gupta,\nshivgupta2370@gmail.com,\n6232362243,\n\nResume:\nhttps://drive.google.com/file/d/1-42s_sR3QSkzJkribxxwbqUwg6Ef9n68/view?usp=sharing`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${name} (${email})`);
    } catch (error) {
        console.error(`Failed to send email to ${name}: ${error.message}`);
    }
};

// Function to process emails sequentially with a delay
const processEmails = async () => {
    for (let i = 0; i < data.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 180000)); // Delay of 3 minute
        const {  COMPANY_NAME, NAME, JOB_ROLE, EMAIL} = data[i];
        await sendEmail( COMPANY_NAME, NAME, JOB_ROLE, EMAIL);
    }
};

// Start the process
processEmails();
