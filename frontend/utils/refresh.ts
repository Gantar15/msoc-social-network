
import {IUserData} from '../models/userData';


interface IErrors{
  errors: any[]
}

export default async function refreshTokens(apiUrl: string): Promise<{data: {refresh: IUserData}} | IErrors> {
    const fetchResult = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation RefreshToken{
              refresh{
                accessToken
                refreshToken
                user{
                  id,
                  name,
                  email,
                  isActivated
                }
              }
            }
          `,
        }),
    });
    return await fetchResult.json();
}