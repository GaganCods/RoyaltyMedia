let currentUpiUrl = '';  // Variable to store current UPI URL
let qrcode; // Global QR code instance

// Initialize donation functionality
function initDonation() {
    // Check if QR code is already initialized
    if (qrcode) {
        return;
    }

    // Initialize QR code
    const qrcodeElement = document.getElementById("qrcode");
    if (!qrcodeElement) {
        return;
    }

    // Clear any existing content
    qrcodeElement.innerHTML = '';
    
    // Initialize QR code
    qrcode = new QRCode(qrcodeElement, {
        width: 256,
        height: 256,
        correctLevel: QRCode.CorrectLevel.H
    });

    // Set initial QR code
    const initialAmount = 100;
    document.getElementById('customAmount').value = initialAmount;
    document.querySelector('.preset-amount[data-amount="100"]').classList.add('active');
    updateQRCode();

    // Handle preset amounts
    document.querySelectorAll('.preset-amount').forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.preset-amount').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update input value
            const amount = button.dataset.amount;
            document.getElementById('customAmount').value = amount;
            
            // Update QR code
            updateQRCode();
        });
    });

    // Handle custom amount input
    const customAmountInput = document.getElementById('customAmount');
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            checkMaxValue(this);
        });
    }

    // Handle donation tabs
    document.querySelectorAll('.donation-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            document.querySelectorAll('.donation-tab').forEach(t => {
                t.classList.remove('active');
            });
            // Add active class to clicked tab
            tab.classList.add('active');
        });
    });
}

function checkMaxValue(input) {
    if (input.value > 100000) {
        input.value = 100000;
    }
    // Remove active class from preset amounts when custom value is entered
    document.querySelectorAll('.preset-amount').forEach(btn => {
        btn.classList.remove('active');
    });
    updateQRCode();
}

function updateQRCode() {
    if (!qrcode) return;

    const amountInput = document.getElementById("customAmount");
    if (!amountInput || !amountInput.value || amountInput.value <= 0) return;
    
    const description = '';
    currentUpiUrl = generateUPILink(amountInput.value, description);
    qrcode.clear();
    qrcode.makeCode(currentUpiUrl);
}

function generateUPILink(amount, description) {
    return `upi://pay?pa=shailendrapratapji@upi&pn=Royalty%20Media&am=${amount}&cu=INR&tn=${description}`;
}

function openUPIApp() {
    const amountInput = document.getElementById("customAmount");
    if (!amountInput || !amountInput.value || amountInput.value <= 0) {
        alert('Please enter a valid donation amount');
        return;
    }

    // Update QR code and URL if needed
    if (!currentUpiUrl) {
        updateQRCode();
    }
    
    // For mobile devices
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = currentUpiUrl;
    } else {
        // For desktop - show a message
        alert('Please use a mobile device with UPI apps installed to use this feature, or scan the QR code.');
    }
}

function downloadQRCode() {
    const qrCanvas = document.querySelector('#qrcode canvas');
    if (!qrCanvas) return;
    
    const borderedCanvas = document.createElement('canvas');
    const ctx = borderedCanvas.getContext('2d');
    borderedCanvas.width = qrCanvas.width + 40;
    borderedCanvas.height = qrCanvas.height + 40;
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, borderedCanvas.width, borderedCanvas.height);
    ctx.drawImage(qrCanvas, 20, 20);

    const link = document.createElement('a');
    link.download = 'royalty_media_donation_qr.png';
    link.href = borderedCanvas.toDataURL('image/png');
    link.click();
}

// Initialize donation functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure modal is added first
    setTimeout(initDonation, 100);
});
