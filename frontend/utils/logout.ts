
export default async function (apiUrl: string, refreshToken: string){
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${refreshToken}`
      },
      credentials: 'include',
      body: JSON.stringify({
        query: `
          mutation Logout{
            logout
          }
        `,
      }),
    });
}