import { useState, useEffect, useContext } from 'react'
import styles from './styles.module.css';
import Sidebar from './ui/sidebar';
import PieChart from './ui/pieChart';
import { Container, Row, Col, Table, Form, InputGroup, Button } from 'react-bootstrap';
import { BsArrowRightShort, BsFillCloudUploadFill, BsFillTrashFill } from 'react-icons/bs';
import { Context } from '../../context/Context';
import { useRouter } from 'next/router';
import axios from '../../utils/axios';

const Dashboard = ({ user = undefined }) => {
  const { setUserName, userName, userData, clientData, setClientData, setUserData } = useContext(Context);
  const [popularCountries, setPopularCountries] = useState([]);
  const [popularCities, setPopularCities] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const clientData = await axios.get(`/client?userCreated=${user}`);
      setClientData(clientData.data)
      const userData = await axios.get(`/client/metadata?userName=${user}`);
      console.log(userData)
      setUserData(userData.data.data.clientData);

    }

    if (user !== undefined) {
      setUserName(user);
      fetchData();
    }

  }, [user])




  const transformArray = (array = []) => {
    let res = [];

    array.forEach(innerArray => {
      const [key, val] = innerArray;
      res.push({
        x: key,
        y: val
      });
    });
    return res;
  }


  useEffect(() => {
    if (!userData) {
      // router.push('/')
    } else {
      const { countries, cities, industries } = userData;
      const sortedCountries = Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 5);
      setPopularCountries(transformArray(sortedCountries));

      const sortedCities = Object.entries(cities).sort((a, b) => b[1] - a[1]).slice(0, 5);
      setPopularCities(transformArray(sortedCities));

      const sortedCategories = Object.entries(industries).sort((a, b) => b[1] - a[1]).slice(0, 5);
      setPopularCategories(transformArray(sortedCategories));
    }
  }, [userData])

  const handleSelectFile = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setUserData(null);
    setClientData(null);
    setPopularCountries([]);
    setPopularCities([]);
    setPopularCategories([]);

    try {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("userName", userName);
      const res = await axios.post('/client', formData);
      setFile(null);
      const clientData = await axios.get(`/client?userCreated=${userName}`);
      setClientData(clientData.data);
      const userData = await axios.get(`/client/metadata?userName=${userName}`);
      setUserData(userData.data.data.clientData);
      setLoading(false);
      
    } catch (error) {
      console.log(error)
    }


  }

  return (
    <div className={styles.dashboard_container}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.module_container}>
        <Container fluid className={styles.module_title}>
          <Row>
            <Col>
              <h1>
                Clientes
              </h1>
            </Col>
            <Col className={styles.form_col}>
              <form className={styles.form} onSubmit={handleSubmit}>
                {(!file) && <><label htmlFor='file' className={styles.file_label}>
                  Actualizar datos
                  <BsFillCloudUploadFill />
                </label>
                  <input type='file' id='file' name='file' accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv" multiple={false} onChange={handleSelectFile} />
                </>
                }

                {(file) && <div className={styles.file_container}>
                  <p>
                    {file.name}
                  </p>
                  <button type='button' onClick={() => setFile(null)}>
                    <BsFillTrashFill />
                  </button>
                  <button type='submit' disabled={false}>
                    Actualizar
                    <BsArrowRightShort />
                  </button>
                </div>}

              </form>
            </Col>
          </Row>
        </Container>

        <Container fluid className={styles.module_content}>
          <Row className={styles.client_data_row}>
            <Col className={styles.data_card}>
              <h4>Países principales</h4>
              <PieChart data={popularCountries} />
            </Col>
            <Col className={styles.data_card}>
              <h4>Ciudades principales</h4>
              <PieChart data={popularCities} />
            </Col>
            <Col className={styles.data_card}>
              <h4>Categorías populares</h4>
              <PieChart data={popularCategories} />
            </Col>
          </Row>

          <Row className={styles.table_data_row}>
            <Table striped bordered hover variant="dark" size="sm">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Country</th>
                  <th>City</th>
                  <th>Category</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {clientData && clientData.data.map(row => {
                  return (<tr key={row._id}>
                    <td>{row.name}</td>
                    <td>{row.country}</td>
                    <td>{row.city}</td>
                    <td>{row.category}</td>
                    <td>{row.isActive.toString()}</td>
                  </tr>)
                })}
              </tbody>
            </Table>
          </Row>

        </Container>

      </div>

    </div>
  )
}

export default Dashboard
