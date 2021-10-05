import { BsFillPersonLinesFill, BsPinMapFill, BsListOl } from "react-icons/bs";
import Link from 'next/link'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const Sidebar = () => {
  return (
    <>
      <h1>AiT</h1>
      <ul>
        <OverlayTrigger
          placement='right'
          overlay={
            <Tooltip id='clients'>
              Clientes
            </Tooltip>
          }
        >
          <li>
            <BsFillPersonLinesFill />
          </li>
        </OverlayTrigger>
        <OverlayTrigger
          placement='right'
          overlay={
            <Tooltip id='category'>
              Categorías
            </Tooltip>
          }
        >
          <li>
            <BsListOl />
          </li>
        </OverlayTrigger>
        <OverlayTrigger
          placement='right'
          overlay={
            <Tooltip id='country'>
              Países
            </Tooltip>
          }
        >
          <li>
            <BsPinMapFill />
          </li>
        </OverlayTrigger>
      </ul>
    </>
  )
}

export default Sidebar
