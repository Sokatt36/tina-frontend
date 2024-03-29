import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Header from '../../header';
import axios from 'axios';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import Head from "next/head";
import Footer from '../../footer';

/**
 * @namespace 'display_employee.js'
 * @description This component provides the functionality to choose a employee.
 * @returns {JSX.Element} A React functional component rendering the client list.
 */
export default function DisplayAndDeleteEmployee() {

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    /**
     * @constant clients
     * @memberof 'display_employee.js'
     * @description A list of employee.
     * @default []
     */ 
    const [employees, setEmployees] = useState([]);

    /**
     * @constant filteredClients
     * @memberof 'display_employee.js'
     * @description A list of employee filtered by the search bar.
     * @default []
     */
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    /**
     * @constant cookies
     * @memberof 'display_employee.js'
     * @see {@link 'header.js'.cookies}
     */
    const cookies = parseCookies();

    /**
     * @constant router
     * @memberof 'display_employee.js'
     * @see {@link 'header.js'.router}
     */
    const router = useRouter();

    /**
     * @function useEffect
     * @memberof 'display_employee.js'
     * @description A React hook that fetches the employee list from the database.
     */
    useEffect(() => {
        fetchCustomers();
        }, []);

    /**
     * @function fetchCustomers
     * @memberof 'display_employee.js'
     * @description Fetches the employee list from the database.
     * @returns {Array} A list of employee.
     */     
    const fetchCustomers = () => {
        axios.get(baseUrl + 'employees/', {
        headers: {
                Authorization: `Token ` + cookies.csrftoken,
            },
            })
            .then((response) => {
                setEmployees(response.data);
                if (filteredEmployees.length === 0) {
                    console.log("filteredClients is empty");
                    setFilteredEmployees(response.data);
                }
            }
            )
            .catch((error) => {
                console.log(error);
            }
        );
    }

    /**
     * @function handleSearch
     * @memberof 'display_employee.js'
     * @description Filters the employee list by the search bar.
     * @param {Event} evt The event that triggered the function.
     * @returns {Array} A list of employee filtered by the search bar.
     */ 
    const handleSearch = (evt) => {
        const searchValue = evt.target.value;
        const filtered = employees.filter((employee) => {
            return employee.first_name.toLowerCase().includes(searchValue.toLowerCase()) || employee.last_name.toLowerCase().includes(searchValue.toLowerCase()) || employee.username.toLowerCase().includes(searchValue.toLowerCase()) || employee.email.toLowerCase().includes(searchValue.toLowerCase());
        });
        setFilteredEmployees(filtered);
    }

    /**
     * @function handleClickClient
     * @memberof 'display_employee.js'
     * @description Redirects to the 'detail_employee' page.
     * @param employee
     */
    const handleClickClient = (employee) => {
        router.push({
            pathname: "./detail_employee",
            query: {
                employee : JSON.stringify(employee)
            },
            });
    }

  return (
    <>
        <Head>
            <meta charSet="utf-8" />
            <title>Detail employé</title>
        </Head>
        <Header />
        <main>
        <div className='container my-5'>
            <div className='row'>
                <div className='col-md-8'>
                <input type="text" placeholder="Rechercher un employé" className="form-control-lg mb-2" onChange={handleSearch}/>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th className='d-none d-sm-block'>Nom d'utilisateur</th>
                    <th>Email</th>
                </tr>
                </thead>
                <tbody style={{cursor:"pointer"}}>
                    {filteredEmployees.map((employee) => (
                        <tr key={employee.id} onClick={() =>  handleClickClient(employee) }>
                            <td >{employee.first_name}</td>
                            <td>{employee.last_name}</td>
                            <td className='d-none d-sm-block'>{employee.username}</td>
                            <td>{employee.email}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
        </main>
        <Footer />
    </>
  );
}