
export default async function (apiUrl: string, refreshToken: string) {
    const fetchResult = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Cookie': `refreshToken=${refreshToken}`
        },
        credentials: 'include'
    });
    return fetchResult.json();
}