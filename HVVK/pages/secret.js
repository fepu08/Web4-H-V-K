import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import Link from "next/link";


export default function Secret() {
  const [session, loading] = useSession();
  const [content, setContent] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/secret");
      const json = await res.json();

      if (json.content) {
        setContent(json.content);
      }
    };
    fetchData();
  }, [session]);

  if (typeof window !== "undefined" && loading) return null;

  if (!session) {
    return (
      <main>
        <div>

        <layout/>



            
          <h1>You aren't signed in, please sign in first</h1>
        </div>
      </main>
    );
  }
  return (
    <main>
      <div>
        <h1> Protected Page</h1>
        <div> you can acces our super secret pages</div>
          
          <button><Link href="/_document">document</Link></button>
        
        <p>{content}</p>
      </div>
    </main>
  );
}