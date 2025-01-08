<?php
// Set your email address where you want to receive messages
$admin_email = "exaple@gmail.com"; // Replace with your email address

// Get form data
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$company = $_POST['company'] ?? '';
$partnership_type = $_POST['partnership-type'] ?? '';
$message = $_POST['message'] ?? '';
$form_type = $_POST['form_type'] ?? 'contact'; // To differentiate between contact and partnership forms

// Set email subject based on form type
$subject = $form_type === 'partnership' 
    ? "New Partnership Request from $name"
    : "New Contact Form Submission from $name";

// Prepare email content
$email_content = "You have received a new message:\n\n";
$email_content .= "Name: $name\n";
$email_content .= "Email: $email\n";

if ($form_type === 'partnership') {
    $email_content .= "Company: $company\n";
    $email_content .= "Partnership Type: $partnership_type\n";
}

$email_content .= "Message:\n$message\n";

// Email headers
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
$success = mail($admin_email, $subject, $email_content, $headers);

// Prepare response
$response = [
    'success' => $success,
    'message' => $success 
        ? 'Thank you for your message. We will get back to you soon!'
        : 'Sorry, there was an error sending your message. Please try again later.'
];

// Send JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
