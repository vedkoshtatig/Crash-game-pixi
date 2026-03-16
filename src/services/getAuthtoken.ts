


export function getAuthToken(){
    const token = new URLSearchParams(location.search).get('token') 

    console.log("toennnnnnnn::::::", token);

    return token;

}