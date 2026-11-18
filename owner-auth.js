// Browser-local shop account workflow for this static-site prototype.
(function () {
    const APPLICATIONS_KEY = 'nearbyShopApplications';
    const ITERATIONS = 210000;

    function applications() {
        const stored = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]');
        if (!Array.isArray(stored)) throw new Error('Shop application storage is invalid.');
        return stored;
    }

    function bytesToHex(bytes) {
        return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    async function hashPassword(password, salt) {
        if (!window.crypto?.subtle) throw new Error('Secure browser cryptography is unavailable. Open the site over HTTPS.');
        const encoder = new TextEncoder();
        const key = await window.crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
        return window.crypto.subtle.deriveBits({
            name: 'PBKDF2',
            salt: Uint8Array.from(salt.match(/.{2}/g), byte => parseInt(byte, 16)),
            iterations: ITERATIONS,
            hash: 'SHA-256'
        }, key, 256);
    }

    async function registerShopOwner(details) {
        const email = details.email.trim().toLowerCase();
        const shopName = details.shopName.trim();
        const businessNumber = details.businessNumber.trim();
        const password = details.password;
        if (!email || !shopName || !businessNumber || password.length < 8) {
            throw new Error('Enter all required shop details and a password with at least 8 characters.');
        }

        const saved = applications();
        const existing = saved.find(item => String(item.email).toLowerCase() === email && item.status !== 'rejected');
        if (existing) {
            if (existing.status === 'approved') throw new Error('An approved shop account already exists for this email. Please sign in.');
            throw new Error('An application for this email is already awaiting review.');
        }

        const salt = bytesToHex(window.crypto.getRandomValues(new Uint8Array(16)));
        const passwordHash = bytesToHex(await hashPassword(password, salt));
        const application = {
            shopName,
            email,
            businessNumber,
            passwordSalt: salt,
            passwordHash,
            status: 'pending',
            submittedAt: new Date().toISOString()
        };
        const rejectedIndex = saved.findIndex(item => String(item.email).toLowerCase() === email && item.status === 'rejected');
        if (rejectedIndex >= 0) saved[rejectedIndex] = application;
        else saved.push(application);
        localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(saved));
        return application;
    }

    async function loginShopOwner(emailValue, password) {
        const email = emailValue.trim().toLowerCase();
        const application = applications().find(item => String(item.email).toLowerCase() === email);
        if (!application) throw new Error('No shop application was found for this email.');
        if (application.status !== 'approved') {
            throw new Error(application.status === 'pending'
                ? 'Your shop application is pending admin approval.'
                : 'This shop application was not approved. Contact the administrator for help.');
        }
        if (!application.passwordSalt || !application.passwordHash) {
            throw new Error('This account has no password set. Reapply for a shop account to create login credentials.');
        }
        const enteredHash = bytesToHex(await hashPassword(password, application.passwordSalt));
        if (enteredHash !== application.passwordHash) throw new Error('The email or password is incorrect.');
        return { email: application.email, name: application.shopName, loginAt: new Date().toISOString() };
    }

    window.registerShopOwner = registerShopOwner;
    window.loginShopOwner = loginShopOwner;
})();
