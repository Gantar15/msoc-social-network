
export default async function (apiUrl: string){
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
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