


export function getAuthToken(){
    const token = new URLSearchParams(location.search).get('token') 

    return token;

}