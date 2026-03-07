import supabase from './supabaseClient';

/**
 * SHA-256 hash a string using the Web Crypto API (built into all modern browsers).
 */
export async function sha256(text) {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Record a login attempt to Supabase login_logs table.
 */
async function logLoginAttempt({ portal, centerId, success }) {
    await supabase.from('login_logs').insert({
        portal,
        center_id: centerId,
        success,
        user_agent: navigator.userAgent,
    });
}

/**
 * Authenticate a Health Center user.
 * @param {string} centerId  - The Center ID entered by the user
 * @param {string} pin       - The PIN entered (will be hashed before checking)
 * @returns {{ success: boolean, user: object|null, error: string|null }}
 */
export async function loginHealthCenter(centerId, pin) {
    try {
        const pinHash = await sha256(pin);

        const { data, error } = await supabase
            .from('health_center_users')
            .select('id, center_id, name, role, is_active')
            .eq('center_id', centerId.trim().toUpperCase())
            .eq('pin_hash', pinHash)
            .eq('is_active', true)
            .single();

        if (error || !data) {
            // Record failed attempt
            await logLoginAttempt({ portal: 'health_center', centerId, success: false });
            return { success: false, user: null, error: 'Invalid Center ID or PIN.' };
        }

        // Record successful login
        await logLoginAttempt({ portal: 'health_center', centerId, success: true });

        return { success: true, user: data, error: null };
    } catch (err) {
        console.error('Login error:', err);
        return { success: false, user: null, error: 'Something went wrong. Try again.' };
    }
}
