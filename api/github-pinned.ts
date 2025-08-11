import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = (req.query.user as string) || '';
  const token = process.env.GH_TOKEN; // đặt trên Vercel Project Settings

  if (!user || !token) return res.status(200).json({ items: [] });

  const query = `query($login:String!) {
    user(login:$login) {
      pinnedItems(first:6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name description url stargazerCount createdAt
            primaryLanguage { name }
            repositoryTopics(first:10) { nodes { topic { name } } }
          }
        }
      }
    }
  }`;

  const r = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ query, variables: { login: user } })
  });

  if (!r.ok) return res.status(200).json({ items: [] });
  const j = await r.json();
  const items = (j.data?.user?.pinnedItems?.nodes || []).map((n: any) => ({
    name: n.name,
    description: n.description,
    url: n.url,
    stars: n.stargazerCount,
    createdAt: n.createdAt,
    primaryLanguage: { name: n.primaryLanguage?.name },
    topics: n.repositoryTopics?.nodes?.map((x: any) => x.topic?.name).filter(Boolean) || []
  }));

  res.status(200).json({ items });
}
