export const API = "https://amour-et-sincerite.com/api/api";

/**
 * Global fetch wrapper. Automatically logs out the user if the backend
 * returns ACCOUNT_SUSPENDED or ACCOUNT_DELETED codes.
 */
export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const res = await fetch(input, init);

    // Clone so we can read body without consuming the original
    const clone = res.clone();
    try {
        const data = await clone.json();
        if (
            data?.code === 'ACCOUNT_SUSPENDED' ||
            data?.code === 'ACCOUNT_DELETED'
        ) {
            // Clear all local auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Show a native alert then redirect to login
            const msg = data?.code === 'ACCOUNT_SUSPENDED'
                ? "⛔ Votre compte a été suspendu par l'administrateur."
                : "⛔ Votre compte a été supprimé.";
            alert(msg);
            window.location.href = '/auth';
        }
    } catch {
        // response was not JSON — ignore
    }

    return res;
}

export default API;
