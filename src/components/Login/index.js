import { useState, useContext } from 'react';
import styles from './styles.module.css';
import { BsArrowRightShort, BsFillCloudUploadFill, BsFillTrashFill } from 'react-icons/bs';
import axios from '../../utils/axios';
import { useRouter } from 'next/router';
import { Context } from '../../context/Context';

const Login = () => {
  const { userName, setUserName, setClientData, setUserData } = useContext(Context);

  // const [userName, setUserName] = useState('');
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientData = await axios.get(`/client?userCreated=${userName}`);
    setClientData(clientData.data)

    if (clientData.data.count > 0) {
      const userData = await axios.get(`/client/metadata?userName=${userName}`);
      setUserData(userData.data.data.clientData);
      router.push('/dashboard');
    }

    if (step === 0) {
      setStep(1);
    }
  }

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("userName", userName);
      await axios.post('/client', formData);
      setTimeout(async() => {
        const clientData = await axios.get(`/client?userCreated=${userName}`);
        setClientData(clientData.data);
        const userData = await axios.get(`/client/metadata?userName=${userName}`);
        setUserData(userData.data.data.clientData);
        router.push(`/dashboard?user=${userName}`);
        setLoading(false);
        setUserName(null)
      }, 7000);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }



  }

  const handleSetUserName = (e) => setUserName(e.target.value);

  const handleSelectFile = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  }

  return (
    <div className={styles.container}>
      <div className={styles.form_container}>
        {step === 0 &&
          <>
            <h1>
              Ai Turing
            </h1>
            <h3>
              Por favor identifícate
            </h3>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input className={styles.text_input} name='userName' type='text' value={userName} onChange={handleSetUserName} />
              <button type='submit' className={styles.small_submit}>
                <BsArrowRightShort />
              </button>
            </form>
          </>
        }

        {step === 1 &&
          <>
            {!loading ? <>
              <h1>
                Ai Turing
              </h1>
              <h3>
                Carga tu archivo .csv, .xslx o .xls
              </h3>

              <form className={styles.form} onSubmit={handleFinalSubmit}>
                {(!file) && <><label htmlFor='file' className={styles.file_label}>
                  Seleccionar archivo
                  <BsFillCloudUploadFill />
                </label>
                  <input type='file' id='file' name='file' accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv" multiple={false} onChange={handleSelectFile} />
                </>
                }

                {(file) && <div className={styles.file_container}>
                  <p>
                    <span>
                      {file.name}
                    </span>
                    <button type='button' onClick={() => setFile(null)}>
                      <BsFillTrashFill />
                    </button>
                  </p>
                  <button type='submit' disabled={loading}>
                    {loading ? 'Cargando...' : 'Continuar'}
                    {!loading && <BsArrowRightShort />}
                  </button>
                </div>}

              </form>
            </> :
              <img src='/images/uploading.gif' alt='animation' />
            }
          </>
        }

      </div>
    </div>
  )
}

export default Login
