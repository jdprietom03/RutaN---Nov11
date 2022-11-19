// Connect to mysql  with serverless-mysql
import mysql from 'serverless-mysql'

const db = mysql({
    config: {
        host: "localhost",
        database: "rutan",
        user: "root",
        password: "Helena@03",
    }
})


export default async function executeQuery({ query, values }:any) {
    try {
      const results = await db.query(query, values);
      await db.end();
      return results;
    } catch (error) {
      return { error };
    }
}