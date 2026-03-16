


export function getAuthToken(){
    const token = new URLSearchParams(location.search).get('token') || undefined

    return token

}