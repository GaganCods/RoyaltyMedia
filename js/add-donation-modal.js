// Add donation modal to the page
function addDonationModal() {
    const modalHtml = `
    <!-- Floating Donation Icon -->
    <div class="floating-donation-icon" data-bs-toggle="modal" data-bs-target="#donationModal">
        <i class="fas fa-heart"></i>
    </div>

    <!-- Donation Modal -->
    <div class="modal fade" id="donationModal" tabindex="-1" aria-labelledby="donationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="donationModalLabel">Support Us</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="donation-content">
                        <div class="donation-tabs">
                            <div class="donation-tab active">UPI Payment</div>
                        </div>
                        
                        <div class="donation-amount">
                            <div class="amount-presets">
                                <div class="preset-amount" data-amount="100">₹100</div>
                                <div class="preset-amount" data-amount="200">₹200</div>
                                <div class="preset-amount" data-amount="500">₹500</div>
                                <div class="preset-amount" data-amount="1000">₹1000</div>
                            </div>
                            
                            <div class="donation-input">
                                <input type="number" class="form-control" id="customAmount" placeholder="Enter amount" min="1" max="100000" oninput="checkMaxValue(this)">
                                <span class="currency-symbol">₹</span>
                            </div>
                        </div>

                        <div class="qr-code-container">
                            <h6 class="text-center mb-3">Scan QR Code to Pay</h6>
                            <div id="qrcode" class="text-center"></div>
                        </div>

                        <div class="donation-buttons">
                            <button class="btn btn-donate btn-upi" onclick="openUPIApp()">
                                <i class="fas fa-mobile-alt"></i>
                                Pay with UPI App
                            </button>
                            <button class="btn btn-donate btn-primary" onclick="downloadQRCode()">
                                <i class="fas fa-download"></i>
                                Download QR
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Initialize donation functionality after modal is added
    if (typeof initDonation === 'function') {
        initDonation();
    }
}

// Add modal when DOM is loaded
document.addEventListener('DOMContentLoaded', addDonationModal);
