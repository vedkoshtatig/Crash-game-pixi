


export function getAuthToken(){
    const token = new URLSearchParams(location.search).get('token') || null

    return token;

}