import { useState, useEffect, useContext } from 'react'
import styles from './styles.module.css';
import Sidebar from './ui/sidebar';
import PieChart from './ui/pieChart';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { Context } from '../../context/Context';
import { useRouter } from 'next/router';
import axios from '../../utils/axios';

const Dashboard = ({ user = undefined }) => {
  const { setUserName, userData, clientData, setClientData, setUserData } = useContext(Context);

  useEffect(() => {
    const fetchData = async () => {
      const clientData = await axios.get(`/client?userCreated=${user}`);
      setClientData(clientData.data)
      if (clientData.data.count > 0) {
        const userData = await axios.get(`/client/metadata?userName=${user}`);
        setUserData(userData.data.data.clientData);
      } 
    }

    if(user !== undefined) {
      setUserName(user);
      fetchData();
    };

  }, [user])

  const [popularCountries, setPopularCountries] = useState([]);
  const [popularCities, setPopularCities] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);

  const router = useRouter();

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
