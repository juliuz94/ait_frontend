import { createContext, useState } from 'react';

const Context = createContext();
const { Provider } = Context;


const ContextProvider = ({children}) => {
  const [userName, setUserName] = useState(process.browser && localStorage.getItem('ai_userName') || '');
  const [clientData, setClientData] = useState(null);
  const [userData, setUserData] = useState(null);

  return (
    <Provider value={{
      userName,
      setUserName: (name) => setUserName(name),
      clientData,
      setClientData: (data) => setClientData(data),
      userData,
      setUserData: (data) => setUserData(data)
    }}>
      {children}
    </Provider>
  )

}

export { ContextProvider, Context}