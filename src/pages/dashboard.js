import Head from 'next/head';
import Dashboard from '../components/Dashboard';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter()
  const { user } = router.query

  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Dashboard user={user} />
      </main>

      <footer>
      </footer>
    </div>
  )
}
