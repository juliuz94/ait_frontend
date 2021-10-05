import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import Head from "next/head";
import { ContextProvider } from '../context/Context'

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
  </>
}

export default MyApp
